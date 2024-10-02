'use client'
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface CopyErrorButtonProps {
  code: [string, string, string, string];
}

const CopyErrorButton: React.FC<CopyErrorButtonProps> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `${code[0]}\n\nContext:\n${code[1]}\n\ncURL:\n${code[2]}\n\nResponse:\n${code[3]}`;
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <Button variant="outline" onClick={copyToClipboard}>
      {isCopied ? "Copied" : "Copy Details"}
    </Button>
  );
};

interface ErrorToastContentProps {
  title?: string;
  info: string;
  context: string;
  curlData: string;
  responseData: string;
}

const ErrorToastContent: React.FC<ErrorToastContentProps> = ({
  title,
  info,
  context,
  curlData,
  responseData,
}) => (
  <div className="flex flex-col gap-2">
    <div className="font-semibold">{title || "Something went wrong"}</div>
    <div className="text-sm">{info}</div>
    <CopyErrorButton code={[info, context, curlData, responseData]} />
  </div>
);

export const useCommonToast = () => {
  const { toast } = useToast();
  const showErrorToast = (
    title: string,
    info: string,
    context: string,
    curlData: string,
    responseData: string
  ) => {
    toast({
      title: title || "Error",
      description: (
        <ErrorToastContent
          title={title}
          info={info}
          context={context}
          curlData={curlData}
          responseData={responseData}
        />
      ),
      variant: "destructive",
    });
  };

  return { showErrorToast };
};

export default useCommonToast;
