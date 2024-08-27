import React, { useMemo } from "react";
import { Button, Card, Col, Flex, Form, InputNumber, Popover, Row } from "antd";
import { Text, Title } from "@/components/antd-sub-components";
import Image from "next/image";
import { currencyFormatter, getTotalPrice } from "@/utils/helpers";
import { IPackage } from "@/utils/crud/package.crud";
import Icon, { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { IAddOn } from "@/utils/crud/addOn.crud";
import { ICustomer } from "@/utils/crud/customer.crud";
import { customerServiceCrud } from "@/utils/crud/customerService.crud";
import { IService } from "@/utils/crud/service.crud";
import { IVehicle } from "@/utils/crud/vehicle.crud";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const GetStartedAddOns = ({
  next,
  addOns,
  customer,
}: {
  next: () => void;
  addOns: IAddOn[];
  customer: ICustomer | null;
}) => {
  const form = Form.useFormInstance();
  const _package: IPackage = Form.useWatch("package", form);
  const service: IService = Form.useWatch("service", form);
  const vehicle: IVehicle = Form.useWatch("vehicle", form);
  const customerAddOns: {
    [key: number]: number;
  } = Form.useWatch("customerAddOns", form);

  const onClickMinus = (addOn: IAddOn) => () => {
    const value = customerAddOns?.[addOn?.id] || 0;
    const newAddOns = {
      ...customerAddOns,
      [addOn?.id]: value - 1 >= 0 ? value - 1 : 0,
    };
    form.setFieldValue("customerAddOns", newAddOns);
  };
  const onClickPlus = (addOn: IAddOn) => () => {
    const value = customerAddOns?.[addOn?.id] || 0;
    const newAddOns = { ...customerAddOns, [addOn?.id]: value + 1 };
    form.setFieldValue("customerAddOns", newAddOns);
  };
  const extraAddOns = useMemo(() => {
    if (!_package) return [];
    if (!addOns?.length) return [];
    return addOns?.filter(
      (addOn) =>
        !_package?.packageAddOns?.some(
          (pAddOn) => pAddOn.addOn?.id === addOn.id,
        ),
    );
  }, [_package, addOns]);
  const totalPrice = useMemo(
    () =>
      getTotalPrice({
        addOns,
        customerAddOns,
        package: _package,
      }),
    [customerAddOns, _package, addOns],
  );
  const onClickAdd = () => {
    const _addOns: {
      [key: number]: number;
    } = {};
    Object.keys(customerAddOns).forEach((key) => {
      const isPackageAddOn = _package?.packageAddOns?.some(
        (pAddOn) => pAddOn.addOn?.id === +key,
      );
      if (isPackageAddOn) {
        _addOns[+key] = customerAddOns[+key];
      } else if (!isPackageAddOn && customerAddOns[+key] > 0) {
        _addOns[+key] = customerAddOns[+key];
      }
    });
    customerServiceCrud
      .create({
        customer: customer?.id,
        service: service?.id,
        vehicle: vehicle?.id,
        package: _package?.id,
        customerAddOns: _addOns,
        totalPrice: `${totalPrice}`,
      })
      .then(() => {
        next();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    _package && (
      <div className="mt-4">
        <Card className="!p-1">
          <Flex gap={16} align="center" className="relative">
            <div>
              <Image
                src={_package?.image}
                alt={_package?.name}
                width={120}
                height={120}
                className="rounded-2xl"
              />
            </div>
            <div>
              <Title level={4} className="!mt-0">
                {_package?.displayName}
              </Title>
              <Title
                level={5}
                type="secondary"
                className="!mt-0 !mb-0 !font-extrabold !text-colorGrey"
              >
                {currencyFormatter.format(_package?.price)}
              </Title>
            </div>
            <Popover
              content={
                <Text className="whitespace-pre">{_package?.description}</Text>
              }
              title={_package?.displayName}
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
        <Row gutter={[16, 16]} className={"max-h-[550px] overflow-y-auto mt-4"}>
          <Col xs={24}>
            <Title level={4} className="!m-0 text-center">
              Included Add-ons
            </Title>
          </Col>

          {_package?.packageAddOns?.map((addOn) => (
            <Col xs={24} key={addOn?.id}>
              <Card className="!p-1">
                <Flex gap={16} align="center">
                  <div>
                    <Image
                      src={addOn?.addOn?.image}
                      alt={addOn?.addOn?.name}
                      width={72}
                      height={72}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="flex-grow">
                    <Title level={5} className="!mt-0">
                      {addOn?.addOn?.name}
                    </Title>
                    <Title
                      level={5}
                      type="secondary"
                      className="!mt-0 !mb-0 !font-extrabold !text-colorGrey"
                    >
                      {currencyFormatter.format(addOn?.addOn?.price)}
                    </Title>
                  </div>
                  <div className="w-32">
                    <InputNumber
                      size="large"
                      addonBefore={
                        <Button
                          className="!h-10 !w-10"
                          icon={<MinusOutlined />}
                          type="text"
                          onClick={onClickMinus(addOn.addOn)}
                        />
                      }
                      addonAfter={
                        <Button
                          className="!h-10 !w-10"
                          icon={<PlusOutlined />}
                          type="text"
                          onClick={onClickPlus(addOn.addOn)}
                        />
                      }
                      value={customerAddOns?.[addOn?.addOn?.id] || 0}
                      min={0}
                      controls={false}
                      placeholder={"0"}
                      className="[&_.ant-input-number-group-addon]:!px-0 [&_.ant-input-number-group-addon]:!bg-white [&_.ant-input-number-input]:!h-10 [&_.ant-input-number-input]:!p-0 [&_.ant-input-number-input]:!text-center"
                    />
                  </div>
                </Flex>
              </Card>
            </Col>
          ))}
          {extraAddOns?.length > 0 && (
            <Col xs={24}>
              <Title level={4} className="!my-4 text-center">
                Extra Add-ons
              </Title>
            </Col>
          )}
          {extraAddOns?.map((addOn) => (
            <Col xs={24} key={addOn.id}>
              <Card className="!p-1 hover:border-primary cursor-pointer group">
                <Flex gap={16} align="center">
                  <div>
                    <Image
                      src={addOn.image}
                      alt={addOn.name}
                      width={72}
                      height={72}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="flex-grow">
                    <Title level={5} className="!mt-0">
                      {addOn?.name}
                    </Title>
                    <Title
                      level={5}
                      type="secondary"
                      className="!mt-0 !mb-0 !font-extrabold !text-colorGrey"
                    >
                      {currencyFormatter.format(addOn?.price)}
                    </Title>
                  </div>
                  <div className="w-32">
                    <InputNumber
                      size="large"
                      addonBefore={
                        <Button
                          className="!h-10 !w-10"
                          icon={<MinusOutlined />}
                          type="text"
                          onClick={onClickMinus(addOn)}
                        />
                      }
                      addonAfter={
                        <Button
                          className="!h-10 !w-10"
                          icon={<PlusOutlined />}
                          type="text"
                          onClick={onClickPlus(addOn)}
                        />
                      }
                      value={customerAddOns?.[addOn?.id] || 0}
                      min={0}
                      controls={false}
                      placeholder={"0"}
                      className="[&_.ant-input-number-group-addon]:!px-0 [&_.ant-input-number-group-addon]:!bg-white [&_.ant-input-number-input]:!h-10 [&_.ant-input-number-input]:!p-0 [&_.ant-input-number-input]:!text-center"
                    />
                  </div>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>
        <Button
          type="primary"
          className="!mt-4"
          block
          size="large"
          onClick={onClickAdd}
        >
          Add {currencyFormatter.format(totalPrice)}
        </Button>
      </div>
    )
  );
};

export default GetStartedAddOns;
