import { Form, Input, Button, Table } from "antd";
import { useState } from "react";

const ShopForm = ({ open, setOpen, addShops }) => {
  console.log(addShops);
  const [value, setValue] = useState("");
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

  ///////////
  const dataSource = [];
  for (let i = 1; i < 4; i++) {
    dataSource.push({
      key: i,
      Campo1: `Informacion ${i}`,
      Campo2: i,
      Campo3: `Gastos ${i}`,
    });
  }

  const columns = [
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
  ];

  ///////////
  const onFinish = ({ shopName, values }) => {
    const shopSketch = {};
    shopSketch[shopName] = values.map((v) => {
      const obj = {};
      obj["title"] = v.charAt(0).toUpperCase() + v.slice(1);
      obj["dataindex"] = v;
      return obj;
    });

    addShops(shopName);
    console.log("obj: ", shopSketch);
  };

  const isNum = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  return (
    <div className="add-shop-window window">
      <div className="add-shop__close" onClick={() => setOpen(false)}>
        &#10005;
      </div>
      <div className="add-shop__content">
        <h1>Creador de plantilla para su negocio</h1>
        <p>
          Es momento de crear su plantilla, para cada día de la semana se creara
          una tabla a completar con la siguiente información. Por favor complete
          de acuerdo a las necesidades de su negocio, pues estos titulos no son
          editables
        </p>
      </div>

      <Form
        name="dynamic_form_item"
        {...formItemLayoutWithOutLabel}
        onFinish={(...values) => {
          onFinish(...values);
          setTimeout(setOpen.bind(false), 1000);
        }}
        style={{ gridColumn: " span 2 / auto" }}
      >
        <Form.Item
          {...formItemLayout}
          name="shopName"
          label="Nombre del negocio"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.List
          name="values"
          rules={[
            {
              validator: async (_, values) => {
                if (!values || values.length < 2) {
                  return Promise.reject(new Error("Al menos 2 campos"));
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
                  {...(index === 0
                    ? formItemLayout
                    : formItemLayoutWithOutLabel)}
                  label={index === 0 ? "Titulos" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message:
                          "Por favor coloque el nombre del campo o eliminelo",
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="Nombre del campo/titulo de plantilla"
                      style={{ width: "60%" }}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <ion-icon
                      size="small"
                      name="remove-circle-outline"
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    ></ion-icon>
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                >
                  <ion-icon name="add-circle-outline"></ion-icon>A&ntilde;ade un
                  campo para la plantilla
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cargar Plantilla
          </Button>
        </Form.Item>
      </Form>
      {/* <Table dataSource={dataSource} columns={columns} />; */}
    </div>
  );
};

export default ShopForm;
