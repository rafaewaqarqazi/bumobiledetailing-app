import React from "react";
import { Button, Card, Col, Divider, Form, Input, Row } from "antd";
import { FormItem, Title } from "@/components/antd-sub-components";
import Image from "next/image";

const GetStartedCar = ({ next }: { next: () => void }) => {
  const form = Form.useFormInstance();
  const car = Form.useWatch("car", form);
  const onClick = (car: string) => () => {
    form.setFieldValue("car", { type: car });
  };
  const onClickNext = () => {
    form
      .validateFields([
        ["car", "make"],
        ["car", "model"],
        ["car", "year"],
        ["car", "licensePlate"],
      ])
      .then(() => {
        next();
      });
  };
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12}>
        <Card
          className=" hover:border-primary cursor-pointer group !p-1"
          onClick={onClick("coupe")}
        >
          <Image
            src="/images/vehicle/coupe.png"
            alt="coupe"
            width={64}
            height={64}
            className="group-hover:scale-105 transition ease-in-out rounded-full"
          />
          <Title level={5} className=" !mt-4 !mb-0 group-hover:!text-primary">
            Coupe
          </Title>
        </Card>
      </Col>
      <Col xs={24} sm={12}>
        <Card
          className=" hover:border-primary cursor-pointer group !p-1"
          onClick={onClick("sedan")}
        >
          <Image
            src="/images/vehicle/sedan.png"
            alt="sedan"
            width={64}
            height={64}
            className="group-hover:scale-105 transition ease-in-out rounded-full"
          />
          <Title level={5} className=" !mt-4 !mb-0 group-hover:!text-primary">
            Sedan
          </Title>
        </Card>
      </Col>
      <Col xs={24} sm={12}>
        <Card
          className=" hover:border-primary cursor-pointer group !p-1"
          onClick={onClick("suv")}
        >
          <Image
            src="/images/vehicle/suv.png"
            alt="suv"
            width={64}
            height={64}
            className="group-hover:scale-105 transition ease-in-out rounded-full"
          />
          <Title level={5} className=" !mt-4 !mb-0 group-hover:!text-primary">
            SUV
          </Title>
        </Card>
      </Col>
      {car?.type && (
        <Col xs={24}>
          <Divider />
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <FormItem
                name={["car", "make"]}
                label="Make"
                rules={[
                  {
                    required: true,
                    message: "Please input the make of your car!",
                  },
                ]}
              >
                <Input size="large" placeholder="Make" />
              </FormItem>
            </Col>
            <Col xs={24} sm={12}>
              <FormItem
                name={["car", "model"]}
                label="Model"
                rules={[
                  {
                    required: true,
                    message: "Please input the model of your car!",
                  },
                ]}
              >
                <Input size="large" placeholder="Model" />
              </FormItem>
            </Col>
            <Col xs={24} sm={12}>
              <FormItem
                name={["car", "year"]}
                label="Year"
                rules={[
                  {
                    required: true,
                    message: "Please input the year of your car!",
                  },
                ]}
              >
                <Input size="large" placeholder="Year" />
              </FormItem>
            </Col>
            {/*<Col xs={24} sm={12}>*/}
            {/*  <FormItem name={["car", "vin"]} label="VIN">*/}
            {/*    <Input size="large" placeholder="VIN" />*/}
            {/*  </FormItem>*/}
            {/*</Col>*/}
            <Col xs={24} sm={12}>
              <FormItem
                name={["car", "licensePlate"]}
                label="License Plate"
                rules={[
                  {
                    required: true,
                    message: "Please input the license plate of your car!",
                  },
                ]}
              >
                <Input size="large" placeholder="License Plate" />
              </FormItem>
            </Col>
            {/*<Col xs={24}>*/}
            {/*  <FormItem name={["car", "color"]} label="Color">*/}
            {/*    <Input size="large" placeholder="Color" />*/}
            {/*  </FormItem>*/}
            {/*</Col>*/}
          </Row>
          <Button type="primary" size="large" block onClick={onClickNext}>
            Next
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default GetStartedCar;
