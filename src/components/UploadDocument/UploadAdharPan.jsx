import { Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { UploadDocuments } from "../../api/api";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

function UploadAdharPan({ account }) {
  const toast = useToast();
  const [fileNameAadharWeb, setFileNameAadharWeb] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [fileSizeAadhar, setFileSizeAadhar] = useState(100004800);
  const [showErrorAadhar, setShowErrorAadhar] = useState(false);
  const [sizeErrorAadhar, setSizeErrorAadhar] = useState(false);
  const [value, setValue] = useState("1");
  const userId = account?.account_id;
  const handleChangeAadharWeb = async (e) => {
    setIsLoading(false);
    if (e.target.files.length > 0) {
      switch (e.target.name) {
        case "file":
          if (
            e.target.files[0]?.type === "image/png" ||
            e.target.files[0]?.type === "image/jpeg" ||
            e.target.files[0]?.type === "image/heic" ||
            e.target.files[0]?.type === "application/pdf"
          ) {
            if (e.target.files[0]?.size < fileSizeAadhar) {
              const fileToUploadAadhar = e.target.files[0];
              const formData = new FormData();
              formData.append("file", fileToUploadAadhar);

              value == 1
                ? formData.append("fileType", "AADHAAR")
                : formData.append("fileType", "PAN");
              setIsLoading(true);
              try {
                const upload = await UploadDocuments(userId, formData);
                if (upload.statusCode === 201) {
                  setShowErrorAadhar(false);
                  setSizeErrorAadhar(false);
                  setFileNameAadharWeb(e.target.files[0].name);
                  toast({
                    title: "Upload Successful",
                    status: "success",
                    isClosable: true,
                  });
                  setIsLoading(false);
                }
              } catch (err) {
                setFileNameAadharWeb(false);
                setIsLoading(false);
              }
            } else {
              setSizeErrorAadhar(true);
              setFileNameAadharWeb("");
            }
          } else {
            setShowErrorAadhar(true);
            setFileNameAadharWeb("");
          }
          break;
        default:
          setFileNameAadharWeb(e.target.value);
      }
    }
  };

  return (
    <>
      <div className="mb-20">
        <div className="flexBox">
          <RadioGroup onChange={setValue} value={value} marginTop={2}>
            <Stack spacing={4} direction="row">
              <Radio value="1" cursor={"pointer"}>
                Aadhar
              </Radio>
              <Radio value="2" cursor={"pointer"}>
                Pan
              </Radio>
            </Stack>
          </RadioGroup>
          <div className="upload-btn-wrapper">
            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              loadingText="Uploading"
            >
              {account?.arohDetails?.aadhaar_url &&
              account?.arohDetails?.pan_url
                ? "Update Doc."
                : "Upload Doc."}
            </Button>
            <input
              id="file2"
              type="file"
              className="hidden"
              name="file"
              disabled={isLoading}
              onChange={(event) => handleChangeAadharWeb(event)}
              onClick={(e) => {
                e.target.value = null;
              }}
              accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
            />
          </div>
        </div>
        {showErrorAadhar ? (
          <div className="mt-0 error text-red-300 bg-opacity-[20%] px-[8px] py-[4px] rounded-[8px] tablet-600 text-[10px]">
            File Format Incorrect
          </div>
        ) : null}
        {sizeErrorAadhar ? (
          <div className="mt-0 error text-red-300 bg-opacity-[20%] px-[8px] py-[4px] rounded-[8px] tablet-600 text-[10px]">
            File Size Exceeds
          </div>
        ) : null}
      </div>
    </>
  );
}

export default UploadAdharPan;
