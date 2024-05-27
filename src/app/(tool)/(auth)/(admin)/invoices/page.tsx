"use client";
import React, {useEffect} from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  doc,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData, clients} from "@/config/data";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {format, set} from "date-fns";
import {Icons} from "@/components/icons";
import Link from "next/link";
const InvoicePage = () => {
  const [data, setData] = React.useState<Invoice[] | undefined>(undefined);

  useEffect(() => {
    const clientDataQuery = query(collection(db, "invoices"));
    const unsubscribe = onSnapshot(clientDataQuery, (querySnapshot) => {
      const invoiceDataLocal: Invoice[] = [];
      querySnapshot.forEach((doc) => {
        invoiceDataLocal.push(doc.data() as Invoice);
      });
      setData(invoiceDataLocal);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div>
        {data ? (
          <div className="container flex flex-col gap-4 mt-6">
            {data.map((invoice, i) => {
              return <InvoiceRow invoice={invoice} key={i} />;
            })}
          </div>
        ) : (
          <>loading ..</>
        )}
      </div>
    </>
  );
};

export default InvoicePage;

const InvoiceRow = ({invoice}: {invoice: Invoice}) => {
  const saveInvoice = async (invoice: Invoice) => {
    // Save the invoice to the database
    await setDoc(doc(db, "invoices", `100${invoice.id}`), invoice);
  };

  const moveVideoToInvoice = async (
    video: InvoiceVideo,
    newInvoiceId: string,
    oldInvoiceId: string
  ) => {
    // Move the video to the new invoice and save to db
  };

  const [collapsed, setCollapsed] = React.useState(true);

  const invoiceTotal = invoice.videos.reduce(
    (acc, video) => acc + Number(video.price),
    0
  );

  const updateVideoPrice = async (video: InvoiceVideo, price: string) => {
    const videoIndex = invoice.videos.findIndex(
      (videoData) => videoData.videoNumber === video.videoNumber
    );
    const newInvoice = {...invoice};
    newInvoice.videos[videoIndex].price = Number(price);
    await setDoc(doc(db, "invoices", invoice.id), newInvoice);
  };

  return (
    <div
      className={`w-full border rounded-md p-2 relative flex flex-col
    ${
      invoice.paid ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
    }
    `}
    >
      <div className="absolute top-2 right-2">
        {invoice.paid ? (
          <div className="text-green-500 flex items-center ">
            <Icons.check className="mr-2" /> Paid{" "}
          </div>
        ) : (
          <Button
            onClick={() => {
              saveInvoice(invoice);
            }}
          >
            Mark as Paid
          </Button>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <h1 className="font-bold text-xl">Invoice #{invoice.id}</h1>
        <h1>
          - ( {format(invoice.startDate, "PPP")} -{" "}
          {format(invoice.endDate, "PPP")})
        </h1>
      </div>
      <div>
        <div className="flex gap-4">
          <h1>Total Videos: {invoice.videos.length}</h1>
          {clients.map((client) => {
            const clientVideos = invoice.videos.filter(
              (video) => video.client === client.value
            );
            return (
              <div key={client.id}>
                {client.label}: {clientVideos.length}
              </div>
            );
          })}
        </div>
        <h1 className="font-bold text-xl">
          {invoiceTotal.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </h1>
      </div>

      <div
        className="cursor-pointer mx-auto text-primary flex gap-2 "
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        {collapsed ? (
          <>
            View Videos <Icons.chevronDown />
          </>
        ) : (
          <>
            Hide Videos <Icons.chevronUp />
          </>
        )}
      </div>

      {!collapsed && (
        <div className="mt-4 flex flex-col gap-4">
          {clients.map((client) => {
            const clientVideos = invoice.videos.filter(
              (video) => video.client === client.value
            );

            return (
              <div key={client.id}>
                <div className="flex gap-2 items-center mb-3">
                  {client.icon && (
                    <client.icon className="h-10 w-10 rounded-lg" />
                  )}
                  <h1 className="font-bold text-xl">{client.label}</h1>
                </div>
                <div className="flex flex-col gap-4">
                  {clientVideos.map((video) => {
                    const dueDate = new Date(video.dueDate);
                    // const startDate = new Date("2024-02-16");
                    const key = Math.random() * 1000;
                    return (
                      <div
                        key={key}
                        className={`border rounded-md w-full flex items-center gap-8 p-2 
              
                
                `}
                      >
                        <div className="font-bold">#{video.videoNumber}</div>

                        <Link
                          target="_blank"
                          href={`/video/${video.videoNumber}`}
                          className="hover:opacity-60"
                        >
                          {video.title}
                        </Link>
                        <div className="flex ml-auto gap-1 items-center">
                          <h1>$</h1>
                          <Input
                            placeholder="Price"
                            className="w-fit ml-auto"
                            value={video.price}
                            onChange={(e) =>
                              updateVideoPrice(video, e.target.value)
                            }
                            type="number"
                            min="1"
                            step="any"
                          />
                        </div>
                        {/* <Select
                  onValueChange={(value) => {
                    moveVideoToInvoice(video, value, invoice.id);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Move to another invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.map((invoiceData) => (
                      <SelectItem key={invoiceData.id} value={invoiceData.id}>
                        {invoiceData.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface Timestamp {
  nanoseconds: number;
  seconds: number;
}

type InvoiceVideo = {
  videoNumber: string;
  client: string;
  title: string;
  dueDate: Date;
  price: number;
};

type Invoice = {
  id: string;
  paid: boolean;
  startDate: string;
  endDate: string;
  videos: InvoiceVideo[];
};

const invoices = [
  {
    id: "1",
    paid: true,
    startDate: "2024-02-16",
    endDate: "2024-03-08",
  },
  {
    id: "2",
    paid: true,
    startDate: "2024-03-08",
    endDate: "2024-04-01",
  },
  {
    id: "3",
    paid: true,
    startDate: "2024-04-02",
    endDate: "2024-04-15",
  },
];
