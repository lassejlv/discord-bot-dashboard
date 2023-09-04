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
import { createBillingSession, createCheckoutSession } from "../actions";
import { useSession } from "next-auth/react";

export default function Billing({ guild }) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [plan, setPlan] = React.useState("PRO");

  console.log("GUILDID", guild?.guildId);

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

                <Button
                  color="success"
                  variant="light"
                  className="mt-4 rounded-md font-bold ml-2"
                  isLoading={buttonLoading}
                  onPress={async () => {
                    setButtonLoading(true);

                    try {
                      const billingPortal = await createBillingSession(
                        session?.user.email
                      );
                    } catch (error) {
                      setButtonLoading(false);
                      alert(error.message);
                    }
                  }}
                >
                  Manage Billing
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
                        Upgrade your plan
                      </ModalHeader>
                      <ModalBody>
                        {/* slected plan */}
                        <div className="flex flex-col gap-2 bg-gradient-to-r from-green-800 to-green-900 rounded-sm p-2">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-white font-semibold text-md">
                              {plan}
                            </h3>
                            <p className="text-gray-300 text-sm">
                              4.99 USD / month
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

                            // create checkout session
                            const createSession = await createCheckoutSession(
                              session?.user.email,
                              guild?.guildId,
                              plan
                            );

                            // redirect to checkout
                            window.location.href = createSession.url;
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
