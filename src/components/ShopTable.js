import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

const EditableContext = React.createContext(null);

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
      console.log('Save failed:', errInfo);
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
            message: `${title} is required.`,
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

class ShopTable extends React.Component {
  constructor(props) {
    super(props);

    //a eliminar
    /* const firstDataSource = [];
    for (let i = 0; i < 2; i++) {
      firstDataSource.push({
        ...this.props.selectedShop
          .map((o) => o.dataIndex)
          .reduce((a, v) => ({ ...a, [v]: `data ${i}` }), {}),
        key: i,
      });
    }
    console.log(firstDataSource); */

    this.columns = [
      ...props.selectedShop,
      {
        title: 'operacion',
        dataIndex: 'operation',
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Seguro de eliminar?" onConfirm={() => this.handleDelete(record.key)}>
              <Button type="link">Eliminar</Button>
            </Popconfirm>
          ) : null,
      },
    ];
    console.log(this.columns);

    this.state = {
      dataSource: this.props.dataSource,

      count: 2,
    };
  }

  handleDelete = (key) => {
    console.log(key);
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      ...this.props.selectedShop
        .map((o) => o.dataIndex)
        .reduce((a, v) => ({ ...a, [v]: `data ${this.state.count}` }), {}),
      key: count,
    };

    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    console.log('col:', this.columns);
    const columns = this.columns.map((col) => {
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
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <div>
        {/* <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Añade una fila
        </Button> */}

        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={[{ title: 'Lunes', children: [...columns] }]}
          /* columns={[
              {
                title: i + 1,
                dataIndex: i,
                children: [...columns],
              },
            ]} */
          // pagination={{ position: ['none', 'none'] }}
          // key={i}
        />
      </div>
    );
  }
}

export default ShopTable;
