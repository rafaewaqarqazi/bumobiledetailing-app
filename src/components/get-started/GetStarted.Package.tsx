import React from "react";
import { Card, Col, Flex, Form, Row } from "antd";
import { Title } from "@/components/antd-sub-components";
import Image from "next/image";
import { currencyFormatter } from "@/utils/helpers";
import { IPackage } from "@/utils/crud/package.crud";
import { IService } from "@/utils/crud/service.crud";

const GetStartedPackage = ({ next }: { next: () => void }) => {
  const form = Form.useFormInstance();
  const service: IService = Form.useWatch("service", form);
  const onClick = (_package: IPackage) => () => {
    form.setFieldValue("package", _package);
    const addOns: {
      [key: number]: number;
    } = {};
    console.log({ _package });
    _package.packageAddOns.forEach((addOn) => {
      addOns[addOn.addOn.id] = 1;
    });
    form.setFieldValue("customerAddOns", addOns);
    next();
  };
  return (
    <Row gutter={[16, 16]}>
      {service?.servicePackages?.map((servicePackage) => (
        <Col xs={24} key={servicePackage?.package?.id}>
          <Card
            className="!p-1 hover:border-primary cursor-pointer group"
            onClick={onClick(servicePackage?.package)}
          >
            <Flex gap={16} align="center">
              <div>
                <Image
                  src={servicePackage?.package?.image}
                  alt={servicePackage?.package?.name}
                  width={120}
                  height={120}
                  className="group-hover:scale-105 transition ease-in-out rounded-2xl"
                />
              </div>
              <div>
                <Title level={4} className="!mt-0 group-hover:!text-primary">
                  {servicePackage?.package?.displayName}
                </Title>
                <Title
                  level={5}
                  type="secondary"
                  className="!mt-0 !mb-0 !font-extrabold !text-colorGrey"
                >
                  {currencyFormatter.format(servicePackage?.package?.price)}
                </Title>
              </div>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default GetStartedPackage;
