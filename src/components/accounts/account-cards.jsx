"use client";

import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useSelector } from "react-redux";
import AccountForm from "./account-form";
import { formatCurrency } from "@/lib/utils";

const AccountCards = () => {
  const accounts = useSelector((state) => state.accounts.accounts);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  return (
    <div>
      <Carousel
        opts={{
          align: "start",
          loop: AccountCards.length > 3,
        }}
        className="w-full"
      >
        <CarouselContent>
          {accounts.map((account) => (
            <CarouselItem
              key={account._id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card
                className="h-full flex flex-col justify-between"
                style={{ borderTopColor: account.color, borderTopWidth: "4px" }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <h3 className="font-medium text-lg">{account.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Account Balance
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        account.balance < 0 ? "text-red-500" : ""
                      }`}
                    >
                      {formatCurrency(account.currentBalance)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}

          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full flex flex-col justify-center items-center p-6 border-dashed">
              <Button
                variant="ghost"
                className="h-full w-full flex flex-col gap-2"
                onClick={() => setIsAddingAccount(true)}
              >
                <PlusCircle className="h-8 w-8" />
                <span>Add Account</span>
              </Button>
            </Card>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <AccountForm
        isOpen={isAddingAccount}
        onClose={() => setIsAddingAccount(false)}
      />
    </div>
  );
};

export default AccountCards;
