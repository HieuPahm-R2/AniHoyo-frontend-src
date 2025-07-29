import { Descriptions, Drawer } from 'antd'
import React from 'react'

const ModalAdjustFilm = () => {
  return (
    <div>
        <Drawer
                title="Chỉnh sửa thông tin phim"
                width={"60vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin Book"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Tên sách">{dataDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetail?.price ?? 0)}</Descriptions.Item>

                    <Descriptions.Item label="Thể loại" span={2}>
                        <Badge status="processing" text={dataDetail?.category} />
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">
                        {moment(dataDetail?.createdAt).format(FORMAT_DATE_DISPLAY)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataDetail?.updatedAt).format(FORMAT_DATE_DISPLAY)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" > Ảnh Books </Divider>

            </Drawer>
    </div>
  )
}

export default ModalAdjustFilm