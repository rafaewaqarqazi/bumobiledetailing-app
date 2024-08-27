import React from "react";
import { Button, Card, Col, Flex, Form, Popover, Row } from "antd";
import { Title } from "@/components/antd-sub-components";
import Image from "next/image";
import { currencyFormatter, getTotalPrice } from "@/utils/helpers";
import { IPackage } from "@/utils/crud/package.crud";
import { IService } from "@/utils/crud/service.crud";
import { customerServiceCrud } from "@/utils/crud/customerService.crud";
import { ICustomer } from "@/utils/crud/customer.crud";
import { IVehicle } from "@/utils/crud/vehicle.crud";
import Icon from "@ant-design/icons";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const GetStartedPackage = ({
  next,
  customer,
}: {
  next: () => void;
  customer: ICustomer | null;
}) => {
  const form = Form.useFormInstance();
  const service: IService = Form.useWatch("service", form);
  const vehicle: IVehicle = Form.useWatch("vehicle", form);
  const onClick = (_package: IPackage) => () => {
    form.setFieldValue("package", _package);
    const addOns: {
      [key: number]: number;
    } = {};
    _package.packageAddOns.forEach((addOn) => {
      addOns[addOn.addOn.id] = 1;
    });
    form.setFieldValue("customerAddOns", addOns);
    customerServiceCrud
      .create({
        customer: customer?.id,
        service: service?.id,
        vehicle: vehicle?.id,
        package: _package?.id,
        customerAddOns: addOns,
        totalPrice: `${getTotalPrice({
          package: _package,
          customerAddOns: addOns,
          addOns: _package.packageAddOns?.map(
            (packageAddOn) => packageAddOn.addOn,
          ),
        })}`,
      })
      .then(() => {
        next();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Row gutter={[16, 16]}>
      {service?.servicePackages?.map((servicePackage) => (
        <Col xs={24} key={servicePackage?.package?.id}>
          <Card
            className="!p-1 hover:border-primary cursor-pointer group"
            onClick={onClick(servicePackage?.package)}
          >
            <Flex gap={16} align="center" className="relative">
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
              <Popover
                content={servicePackage?.package?.description}
                title={servicePackage?.package?.displayName}
              >
                <Button
                  className="!absolute top-0 right-0"
                  icon={
                    <Icon
                      className="!text-2xl [&_svg]:!fill-white"
                      component={InformationCircleIcon}
                    />
                  }
                  type="text"
                />
              </Popover>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default GetStartedPackage;
