"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React from "react";
import StarIcon from "./icons/star";
import SadIcon from "./icons/sad";

export default function Billing({ guild }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [plan, setPlan] = React.useState("PRO");

  return (
    <div>
      <Card className="shadow-none rounded-md bg-gradient-to-bl from-green-800 to-slate-800">
        <CardBody>
          {guild?.subscriptionType === "FREE" ? (
            <>
              <div className="">
                <h3 className="text-white font-semibold text-md">
                  This guild is on the free plan.
                </h3>
                <p className="text-gray-300 text-sm">
                  You can upgrade to a paid plan to unlock more features.
                </p>

                <Button
                  color="success"
                  variant="flat"
                  className="mt-4 rounded-md font-bold"
                  endContent={<StarIcon />}
                  onPress={onOpen}
                >
                  Upgrade your plan
                </Button>
              </div>

              {/* modal */}
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className="bg-gray-950"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Choose your plan
                      </ModalHeader>
                      <ModalBody>
                        <Select
                          variant="faded"
                          label="Select your plan"
                          onChange={(e) => {
                            if (e.target.value === "") {
                              setPlan("PRO");
                            }
                            setPlan(e.target.value);
                          }}
                          isDisabled={buttonLoading}
                        >
                          <SelectItem key={"PRO"} value={"PRO"}>
                            Pro
                          </SelectItem>
                          <SelectItem key={"Ultra"} value={"ULTRA"}>
                            Ultra
                          </SelectItem>
                        </Select>

                        {/* slected plan */}
                        <div className="flex flex-col gap-2 mt-4 bg-gradient-to-r from-green-800 to-green-900 rounded-sm p-2">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-white font-semibold text-md">
                              {plan}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              {plan === "PRO" ? "$2.99/month" : "$4.99/month"}
                            </p>
                          </div>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="flat"
                          onPress={onClose}
                          endContent={<SadIcon />}
                          isDisabled={buttonLoading}
                        >
                          Never mind
                        </Button>
                        <Button
                          color="success"
                          variant="flat"
                          endContent={<StarIcon />}
                          onPress={async () => {
                            setButtonLoading(true);
                          }}
                          isLoading={buttonLoading}
                        >
                          Upgrade plan
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
