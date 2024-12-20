"use client";
import React, {useEffect} from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {VideoData, Invoice, EDITORS, clients} from "@/config/data";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {convertTimestampToDate} from "@/lib/utils";
import {UserData} from "@/context/user-auth";
import {Checkbox} from "@/components/ui/checkbox";

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import Link from "next/link";
import {EditorSelector} from "../../(editors)/dashboard/components/editor-selector";
import {Switch} from "@/components/ui/switch";

import {Label} from "@/components/ui/label";
import {Calendar} from "@/components/ui/calendar";
import {addDays, format, subDays} from "date-fns";
import {DateRange} from "react-day-picker";

const InvoicePage = () => {
  const [invoices, setInvoices] = React.useState<Invoice[] | undefined>(
    undefined
  );

  const [videoData, setVideoData] = React.useState<VideoData[] | undefined>();

  useEffect(() => {
    const q = query(collection(db, "invoices"), orderBy("date", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const invoiceArray = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as Invoice)
        );
        setInvoices(invoiceArray);
      },
      (error) => {
        console.error("Error fetching video data: ", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const [createInvoice, setCreateInvoice] = React.useState(true);
  const [editors, setEditors] = React.useState<UserData[] | undefined>();

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const editorPromises = EDITORS.map(async (editor) => {
          const dataSnap = await getDoc(doc(db, "users", editor.id));
          return dataSnap.data() as UserData;
        });

        const editorData = await Promise.all(editorPromises);
        setEditors(editorData);
      } catch (error) {
        console.error("Error fetching editor data: ", error);
      }
    };

    fetchEditors();
  }, []);

  const [editor, setEditor] = React.useState<string | undefined>();

  return (
    <>
      <div className=" relative pt-20">
        {editors && invoices ? (
          <div className="container flex flex-col gap-4 mt-6">
            {invoices.map((invoice, i) => {
              return (
                <InvoiceRow
                  invoice={invoice}
                  key={invoice.id}
                  editors={editors}
                />
              );
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

const InvoiceRow = ({
  invoice,
  editors,
}: {
  invoice: Invoice;
  editors: UserData[];
}) => {
  const invoiceFor = editors.find((editor) => editor.uid === invoice.editor);

  const [videos, setVideos] = React.useState<VideoData[] | undefined>();

  useEffect(() => {
    const fetchVideos = async () => {
      const videosPromises = invoice.videos.map(async (videoId) => {
        const video = await getDoc(doc(db, "videos", videoId));
        return video.data() as VideoData;
      });

      const videosLocal = await Promise.all(videosPromises);
      setVideos(videosLocal);
      setSelectedVideos(videosLocal.map((video) => video.videoNumber));
    };

    fetchVideos();
  }, [invoice]);

  const [selectedVideos, setSelectedVideos] = React.useState<string[]>();
  const [paid, setPaid] = React.useState<boolean>(invoice.paid || false);

  useEffect(() => {
    const updatePaid = async () => {
      await updateDoc(doc(db, "invoices", invoice.id), {
        paid,
      });
    };

    const updateVideos = async () => {
      if (!videos) {
        console.error("Videos are undefined");
        return;
      }
      const videoPromises: Promise<void>[] = videos.map(async (video) => {
        await updateDoc(doc(db, "videos", video.videoNumber), {
          paid,
        });
      });

      await Promise.all(videoPromises);
    };

    if (paid !== invoice.paid) {
      updatePaid();
      updateVideos();
    }
  }, [paid, invoice, videos]);

  return (
    <div
      className={`w-full border rounded-md p-4 relative flex flex-col text-primary bg-foreground 

    `}
    >
      {paid && (
        <div className="h-full w-full absolute top-0 left-0 bg-primary/60 blurBackSmaall z-20 items-center justify-center flex font-bold text-5xl text-green-500 pointer-events-none">
          Paid
        </div>
      )}
      <div className="flex justify-between relative z-10">
        <div className="grid grid-cols-5">
          <div className="grid gap-1">
            <span className="text-muted-foreground">Editor</span>
            {invoiceFor && (
              <span className="text-primary text-xl font-bold">
                {invoiceFor.firstName}
              </span>
            )}
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-primary text-xl font-bold">
              {formatAsUSD(invoice.total)}
            </span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Total Videos</span>
            <span className="text-primary text-xl font-bold">
              {invoice.videos.length}
            </span>
          </div>
          <div className="grid gap-1">
            <span className="text-muted-foreground">Method</span>
            <span className="text-primary text-xl font-bold">
              {invoice.method === "paypal" ? (
                <div className="flex items-center">
                  <Icons.paypal className="h-6 w-6 mr-2" />
                  Paypal
                </div>
              ) : (
                <div className="flex items-center">
                  <Icons.wise className="h-6 w-6 mr-2 rounded-md" />
                  Wise
                </div>
              )}
            </span>
          </div>
          <div className="grid gap-1">
            <h1>Date</h1>
            <span className="text-primary text-xl font-bold">
              {format(convertTimestampToDate(invoice.date), "MM/dd/yyyy")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Switch id="paid" checked={paid} onCheckedChange={setPaid} />
          <Label
            htmlFor="airplane-mode"
            className={`${paid ? "text-green-500" : "text-red-500"}`}
          >
            {paid ? "Paid" : "Not Paid"}
          </Label>
        </div>
      </div>
      <div className="mt-4 relative z-10">
        {videos && (
          <div className="grid grid-cols-2 gap-2 text-primary">
            {videos.map((video, i) => {
              const client = clients.find(
                (c: any) => c.value === video.clientId
              )!;
              const isSelected =
                selectedVideos && selectedVideos.includes(video.videoNumber);

              return (
                <div
                  key={i}
                  className="w-full flex items-center border p-2 rounded-md"
                >
                  <div className="flex items-center gap-1">
                    <h1 className="text-primary mx-2">#{video.videoNumber}</h1>
                    <client.icon className="h-6 w-6 text-muted-foreground rounded-md" />
                  </div>
                  <h1 className="text-primary ml-auto">
                    {formatAsUSD(video.priceUSD)}
                  </h1>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

function formatAsUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
