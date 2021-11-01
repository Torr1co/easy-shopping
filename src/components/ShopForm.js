import React, { Form, Input, Button, Modal /*  Table  */ } from 'antd';
import { uploadShopData } from '../firebase-config';
// import { useState } from "react";

const ShopForm = ({ open, setOpen, addShopName, addShopSketch, shopNames }) => {
  const [form] = Form.useForm();
  // const [value, setValue] = useState("");
  if (!open) return null;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  /// ////////
  const dataSource = [];
  for (let i = 1; i < 4; i++) {
    dataSource.push({
      key: i,
      Campo1: `Informacion ${i}`,
      Campo2: i,
      Campo3: `Gastos ${i}`,
    });
  }

  /* const columns = [
    {
      title: "Campo1",
      dataIndex: "Campo1",
    },
    {
      title: "Campo2",
      dataIndex: "Campo2",
    },
    {
      title: "Campo3",
      dataIndex: "Campo3",
    },
  ]; */

  /// ////////
  const onFinish = ({ shopName, values }) => {
    const shopSketch = {};
    shopSketch[shopName] = values.map((v) => {
      const obj = {};
      obj.title = v.charAt(0).toUpperCase() + v.slice(1);
      obj.dataIndex = v;
      obj.editable = true;
      return obj;
    });

    uploadShopData(shopName, shopSketch).then(() => {
      addShopName(shopName);
      addShopSketch(shopSketch);
      console.log('obj: ', shopSketch);
      console.log('sn:', shopName);
    });
  };

  /* const isNum = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setValue(e.target.value);
    }
  }; */

  return (
    <Modal
      style={{ padding: '1rem 2rem' }}
      title="Creador de plantilla para su negocio"
      width={1000}
      visible={open}
      okText="Cargar plantilla"
      onOk={() => {
        form
          .validateFields()
          .then((...values) => {
            form.resetFields();
            onFinish(...values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      onCancel={() => setOpen(false)}
    >
      <p style={{ marginBottom: '30px' }}>
        Es momento de crear su plantilla, para cada día de la semana se creara una tabla a completar
        con la siguiente información. Por favor complete de acuerdo a las necesidades de su negocio,
        pues estos titulos no son editables
      </p>

      <Form
        form={form}
        name="dynamic_form_item"
        {...formItemLayoutWithOutLabel}
        style={{ gridColumn: ' span 2 / auto' }}
        autoComplete="off"
      >
        <Form.Item
          {...formItemLayout}
          name="shopName"
          label="Nombre del negocio"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, shopName) {
                console.log(shopName);
                if (shopNames.includes(shopName.toLowerCase()))
                  return Promise.reject(new Error('Ya existe una plantilla con ese nombre!'));
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.List
          name="values"
          rules={[
            {
              validator: async (_, values) => {
                if (!values || values.length < 2) {
                  return Promise.reject(new Error('Al menos 2 campos'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {/* <Form.Item {...formItemLayout} label="negocios" required={false}>
                <Form.Item
                  validateTrigger={["onChange", "onBlur"]}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Por favor coloque el nombre del negocio",
                    },
                  ]}
                  noStyle
                >
                  <Input
                    placeholder="Nombre del negocio"
                    style={{ width: "60%" }}
                  />
                </Form.Item>
              </Form.Item> */}
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? 'Titulos' : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Por favor coloque el nombre del campo o eliminelo',
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="Nombre del campo/titulo de plantilla"
                      style={{ width: '60%' }}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <ion-icon
                      size="small"
                      name="remove-circle-outline"
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  <ion-icon name="add-circle-outline" />
                  A&ntilde;ade un campo para la plantilla
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
      {/* <Table dataSource={dataSource} columns={columns} />; */}
    </Modal>
  );
};

export default ShopForm;
