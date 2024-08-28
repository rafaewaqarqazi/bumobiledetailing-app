import React from "react";
import { Button, Card, Col, Divider, Form, Input, Row } from "antd";
import { FormItem, Title } from "@/components/antd-sub-components";
import Image from "next/image";
import { IVehicle, vehicleCrud } from "@/utils/crud/vehicle.crud";
import { ICustomer } from "@/utils/crud/customer.crud";

const GetStartedCar = ({
  next,
  customer,
}: {
  next: () => void;
  customer?: ICustomer | null;
}) => {
  const form = Form.useFormInstance();
  const car: IVehicle & { info: string } = Form.useWatch("car", form);
  const onClick = (car: string) => () => {
    form.setFieldValue("car", { type: car });
  };
  const onClickNext = () => {
    form
      .validateFields([["car", "info"]])
      .then(() => {
        const carInfo = car?.info.split("/");
        vehicleCrud
          .create({
            type: car?.type,
            make: carInfo[1],
            model: carInfo[2],
            year: carInfo[0],
            customer: customer?.id,
          })
          .then((res) => {
            form.setFieldValue(["car", "id"], res.data.data.id);
            next();
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card
          className={` hover:border-primary cursor-pointer group !p-1 ${car?.type === "coupe" ? "border-primary" : ""}`}
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
      <Col xs={24} sm={8}>
        <Card
          className={` hover:border-primary cursor-pointer group !p-1 ${car?.type === "sedan" ? "border-primary" : ""}`}
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
      <Col xs={24} sm={8}>
        <Card
          className={` hover:border-primary cursor-pointer group !p-1 ${car?.type === "suv" ? "border-primary" : ""}`}
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

          <FormItem
            name={["car", "info"]}
            label="Vehicle"
            rules={[
              {
                required: true,
                message: "Please input the info of your car!",
                pattern: new RegExp(
                  /^[0-9]{4}\s\/[a-zA-Z0-9\s]+\/[a-zA-Z0-9\s]+$/,
                ),
              },
            ]}
          >
            <Input size="large" placeholder="Year / Make / Model" />
          </FormItem>

          {/*<Col xs={24} sm={8}>*/}
          {/*  <FormItem*/}
          {/*    name={["car", "model"]}*/}
          {/*    label="Model"*/}
          {/*    rules={[*/}
          {/*      {*/}
          {/*        required: true,*/}
          {/*        message: "Please input the model of your car!",*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  >*/}
          {/*    <Input size="large" placeholder="Model" />*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
          {/*<Col xs={24} sm={8}>*/}
          {/*  <FormItem*/}
          {/*    name={["car", "year"]}*/}
          {/*    label="Year"*/}
          {/*    rules={[*/}
          {/*      {*/}
          {/*        required: true,*/}
          {/*        message: "Please input the year of your car!",*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  >*/}
          {/*    <Input size="large" placeholder="Year" />*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
          {/*<Col xs={24} sm={8}>*/}
          {/*  <FormItem name={["car", "vin"]} label="VIN">*/}
          {/*    <Input size="large" placeholder="VIN" />*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
          {/*<Col xs={24} sm={8}>*/}
          {/*  <FormItem*/}
          {/*    name={["car", "licensePlate"]}*/}
          {/*    label="License Plate"*/}
          {/*    rules={[*/}
          {/*      {*/}
          {/*        required: true,*/}
          {/*        message: "Please input the license plate of your car!",*/}
          {/*      },*/}
          {/*    ]}*/}
          {/*  >*/}
          {/*    <Input size="large" placeholder="License Plate" />*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
          {/*<Col xs={24}>*/}
          {/*  <FormItem name={["car", "color"]} label="Color">*/}
          {/*    <Input size="large" placeholder="Color" />*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}

          <Button type="primary" size="large" block onClick={onClickNext}>
            Next
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default GetStartedCar;
