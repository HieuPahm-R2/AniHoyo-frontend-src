import React, { useRef, useState } from 'react'
import { ALL_PERMISSIONS } from '../../config/permission';
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import Access from '../../components/share/access';

const RoleManage = () => {
    const [openModal, setOpenModal] = useState(false);

    const tableRef = useRef();

    const isFetching = useAppSelector((state) => state.role.isFetching);
    const meta = useAppSelector((state) => state.role.meta);
    const roles = useAppSelector((state) => state.role.result);
    const dispatch = useAppDispatch();
    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            width: 250,
            render: (text, record, index, action) => {
                return <span>{record.id}</span>;
            },
            hideInSearch: true,
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Trạng thái",
            dataIndex: "active",
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <Tag color={entity.active ? "lime" : "red"}>
                            {entity.active ? "ACTIVE" : "INACTIVE"}
                        </Tag>
                    </>
                );
            },
            hideInSearch: true,
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>
                        {record.createdTime
                            ? dayjs(record.createdTime).format("DD-MM-YYYY HH:mm:ss")
                            : ""}
                    </>
                );
            },
            hideInSearch: true,
        },
        {
            title: "UpdatedAt",
            dataIndex: "updatedTime",
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>
                        {record.updatedTime
                            ? dayjs(record.updatedTime).format("DD-MM-YYYY HH:mm:ss")
                            : ""}
                    </>
                );
            },
            hideInSearch: true,
        },
        {
            title: "Actions",
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.ROLES.UPDATE} hideChildren>
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: "#ffa500",
                            }}
                            type=""
                            onClick={() => {
                                dispatch(fetchRoleById(entity.id));
                                setOpenModal(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.ROLES.DELETE} hideChildren>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa role"}
                            description={"Bạn có chắc chắn muốn xóa role này ?"}
                            onConfirm={() => handleDeleteRole(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: "#ff4d4f",
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];
    return (
        <div>
            <Access permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}>
                <DataTable
                    actionRef={tableRef}
                    headerTitle="Danh sách Roles (Vai Trò)"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={roles}
                    request={async (params, sort, filter) => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchRole({ query }));
                    }}
                    scroll={{ x: true }}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => {
                            return (
                                <div>
                                    {" "}
                                    {range[0]}-{range[1]} trên {total} rows
                                </div>
                            );
                        },
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows) => {
                        return (
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Thêm mới
                            </Button>
                        );
                    }}
                />
            </Access>
            <ModalRole
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
            />
        </div>
    )
}

export default RoleManage