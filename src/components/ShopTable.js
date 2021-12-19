import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
const EditableContext = React.createContext(null);
const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Error al guardar:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} es requerido.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const ShopTable = ({
  selectedShop,
  weekDataSource,
  setWeekDataSource,
  monthDataSource,
  setMonthDataSource,
  dayKey,
  index,
}) => {
  const [count, setCount] = useState(3);
  const updateWeekDataSource = (newValue) => {
    setWeekDataSource({
      ...weekDataSource,
      [dayKey]: newValue,
    });
  };

  let columns = [
    ...selectedShop,
    {
      title: 'operacion',
      dataIndex: 'operation',
      render: (_, record) =>
        weekDataSource[dayKey].length >= 1 ? (
          <Popconfirm title="Seguro de eliminar?" onConfirm={() => handleDelete(record.key)}>
            <Button type="link">Eliminar</Button>
          </Popconfirm>
        ) : null,
    },
  ];
  // console.log(this.columns);

  const handleDelete = (key) => {
    updateWeekDataSource(weekDataSource[dayKey].filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    const newData = {
      ...selectedShop.map((o) => o.dataIndex).reduce((a, v) => ({ ...a, [v]: 0 }), {}),
      key: count,
    };
    setCount(count + 1);
    updateWeekDataSource([...weekDataSource[dayKey], newData]);

    /* this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    }); */
  };
  const handleSave = (row) => {
    const newData = [...weekDataSource[dayKey]];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    updateWeekDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Añade una fila
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={weekDataSource[dayKey]}
        columns={[
          {
            title: `${days[index]} ${dayKey.slice(-2)} / ${dayKey.slice(5, -3)} `,
            children: [...columns],
          },
        ]}
        pagination={{ position: ['none', 'none'] }}
        // key={i}
        style={{ border: '2px #d9d9d9 solid', marginBottom: '32px' }}
        summary={(pageData) => {
          //obtener Balance para cada uno
          let balance = 0;
          /* dayKey.slice(0, 7);//mes
          dayKey.slice(-2);//dia-1 por indice de array */
          const dayIndex = +dayKey.slice(-2) - 1;
          pageData.forEach((e) => {
            for (const [key, value] of Object.entries(e)) {
              if (!isNaN(value) && key !== 'key') {
                balance += +value;
              }
            }
          });

          if (monthDataSource[+dayIndex] !== balance) {
            console.log(dayIndex);
            const newMonthData = monthDataSource;
            newMonthData[+dayIndex] = balance;
            setMonthDataSource(newMonthData);
          }

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={columns.length - 1}>{balance}</Table.Summary.Cell>
                <Table.Summary.Cell>Balance</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </div>
  );
};

export default ShopTable;
