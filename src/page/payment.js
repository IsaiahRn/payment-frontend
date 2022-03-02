import React, { useState } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Form, Input, Button, Modal } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isEmpty } from "lodash";

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
};
const formTailLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
    offset: 4,
  },
};

const MakePayment = () => {
  
  const [form] = Form.useForm();
  
  toast.configure({
    autoClose: 8000,
  });
  
  const [state, setState] = useState({
    CardNumber: "",
    ExpDate: "",
    Cvv: "",
    Amount: "",
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [inputErrors, setInputErrors] = useState("");
  const [responseData, setReponseData] = useState("");

  const {CardNumber, ExpDate, Cvv, Amount} = state;

  const checkIputState = () => {
    switch(true) {
      case isEmpty(CardNumber):
        return true
      case isEmpty(ExpDate):
        return true
      case isEmpty(Cvv):
        return true
      case isEmpty(Amount):
        return true
      case !isEmpty(inputErrors):
        return true
      default:
        return false
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const makePayment = (e) => {
    e.preventDefault();
    const payload = {
      CardNumber: state.CardNumber,
      ExpDate: state.ExpDate,
      Cvv: state.Cvv,
      Amount: state.Amount,
    };

    axios
      .post(
        "https://payment-acceptance.herokuapp.com/api/v1/payment",
        payload,
        {
          headers: {},
        }
      )
      .then((res) => {
        if (res.data.status === 400) {
          setInputErrors(res.data.message[0]);
        } else {
          setReponseData(res.data)
          showModal()
          setInputErrors("")
        }
      })
      .catch((res) => {
        toast.error(res.response.data.message);
      });
  };

  const handleOnChange = (e) => {
    e.persist();
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="payment_form">
      <p className="title">Payment form</p>
      <Form form={form} name="dynamic_rule">
        <Form.Item
          {...formItemLayout}
          name="CardNumber"
          label="Card Number"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            name="CardNumber"
            value={state.CardNumber}
            onChange={handleOnChange}
            placeholder="Input your card number"
          />
          {inputErrors.includes("CardNumber") ? (
            <span className="error_fields">{inputErrors}</span>
          ) : null}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="ExpDate"
          label="Exp.Date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            name="ExpDate"
            value={state.ExpDate}
            onChange={handleOnChange}
            placeholder="Input your expiry Date"
          />
          {inputErrors.includes("ExpDate") ? (
            <span className="error_fields">{inputErrors}</span>
          ) : null}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="Cvv"
          label="CVV"
          rules={[
            {
              required: true
            },
          ]}
        >
          <Input
            name="Cvv"
            value={state.Cvv}
            onChange={handleOnChange}
            placeholder="Input your cvv"
          />
          {(inputErrors.includes("Cvv") || inputErrors.includes("CVV")) ? (
            <span className="error_fields">{inputErrors}</span>
          ) : null}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="Amount"
          label="Amount"
          rules={[
            {
              required: true
            },
          ]}
        >
          <Input
            name="Amount"
            value={state.Amount}
            onChange={handleOnChange}
            placeholder="Input your amount"
          />
          {inputErrors.includes("Amount") ? (
            <span className="error_fields">{inputErrors}</span>
          ) : null}
        </Form.Item>
        <Form.Item {...formTailLayout}>
          <Button disabled={checkIputState()} type="primary" onClick={makePayment}>
            Pay
          </Button>
        </Form.Item>
      </Form>
      <Modal title={responseData.message} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>{`RequestId: ${responseData.RequestId}`}</p>
        <p>{`Amount: ${responseData.Amount}`}</p>
      </Modal>
    </div>
  );
};

export default MakePayment;
