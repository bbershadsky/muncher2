import React from "react";
import { useTable, HttpError, useForm } from "@refinedev/core";
import {
  Table as AntdTable,
  Space as AntdSpace,
  List,
  Input,
  Button,
  message,
  Tag,
  Typography,
  Form,
} from "antd";
import {TextField } from "@refinedev/antd";
import ReactMarkdown from "react-markdown";

// Define the data interface
interface IVideo {
  id: string;
  title: string;
  markdownData?: string; // Optional markdown content
  creator?: string; // Optional creator name
  views?: number; // Optional views count
  sourceUrl: string;
  totalTimeMinutes: number; // Video duration in minutes
  modelUsed?: string; // Model used for summary
  $updatedAt?: string; // Timestamp for sorting
}

const COLLECTION_ID = import.meta.env.NEXT_PUBLIC_APPWRITE_WATCHSAVER_COLLECTION_ID;

export const WatchSaverList: React.FC = () => {
const { onFinish } = useForm({
  resource: COLLECTION_ID,
  action: "create",
  redirect: false, // Prevent navigation on success
});


  const { tableQuery } = useTable<IVideo, HttpError>({
    syncWithLocation: true,
    resource: COLLECTION_ID,
    liveMode: "auto",
    sorters: {
      initial: [
        {
          field: "$updatedAt",
          order: "desc", // Ensure sorting in descending order by last updated
        },
      ],
    },
  });

  const videos = tableQuery?.data?.data ?? []; // Fetch table data

  if (tableQuery?.isLoading) {
    return <div>Loading...</div>;
  }

   const handleAddUrl = async (values: { sourceUrl: string }) => {
     if (!values.sourceUrl) {
       message.error("Please enter a valid URL.");
       return;
     }

     try {
       await onFinish({
         ...values,
         isSubtitlesProcessed: false, // Additional fields
       });
       message.success("URL added successfully! Processing...");
       values.sourceUrl = ""
     } catch (error) {
       console.error(error);
       message.error("Failed to add URL. Please try again.");
     }
   };

  return (
    <List>
      <AntdTable
        dataSource={videos} // Correctly assign data to the table
        rowKey="id"
        pagination={{
          pageSize: 10, // Adjust page size as needed
        }}
      >
        {/* Title Column with Markdown */}
        <AntdTable.Column
          title="Title"
          dataIndex="title"
          key="title"
          render={(value, record: IVideo) => (
            <>
              <TextField value={value} />
              {record.markdownData && (
                <>
                  <Typography.Paragraph
                    style={{ fontSize: "12px", marginTop: "4px" }}
                  >
                    <ReactMarkdown>{record.markdownData}</ReactMarkdown>
                  </Typography.Paragraph>
                  {record.modelUsed && (
                    <Tag color="blue" style={{ marginTop: "4px" }}>
                      {record.modelUsed}
                    </Tag>
                  )}
                </>
              )}
            </>
          )}
        />

        {/* Combined Column */}
        <AntdTable.Column
          title="Details"
          key="details"
          render={(record: IVideo) => (
            <TextField
              value={`By ${record.creator || "Unknown"} | ${
                record.views ? `${record.views.toLocaleString()} views` : "N/A"
              } | ${record.totalTimeMinutes || "N/A"} min`}
            />
          )}
        />

        {/* YouTube Video Column */}
        <AntdTable
          dataSource={videos}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
        >
          <AntdTable.Column
            title={
              <Form
                layout="inline"
                onFinish={handleAddUrl} // Trigger on form submit
              >
                <Form.Item
                  name="sourceUrl"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a valid URL.",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter YouTube URL"
                    style={{ width: 300 }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    +
                  </Button>
                </Form.Item>
              </Form>
            }
            dataIndex="sourceUrl"
            key="sourceUrl"
            render={(value) => (
              <AntdSpace>
                <iframe
                  width="300"
                  height="200"
                  src={value.replace("youtu.be/", "www.youtube.com/embed/")}
                  title="YouTube video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </AntdSpace>
            )}
          />
        </AntdTable>
      </AntdTable>
    </List>
  );
};
