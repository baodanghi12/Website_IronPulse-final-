import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const Actions = () => {
    // const [isLoading, setIsLoading] = useState(false);
    // const [logs, setLogs] = useState([]); // Không cần kiểu dữ liệu trong JavaScript
    // useEffect(() => {
    //     setApi(`/logs?limit=${limit}&page${page}`);
    // }, []);
    // useEffect(() => {
    //     setApi(`/logs?limit=${limit}&page${page}`);
    // }, [page, limit]);
    // useEffect (() =>{
    //     api && getLogs(api);
    // }, [api]);
    // const getLogs = async (url) => {
    //     setIsLoading(true);
    //     try {
    //         const res = await handleAPI(url); // Gọi API
    //         setLogs(res.data.items); // Cập nhật logs với dữ liệu từ API
    //         setTotal(res.data.total);
    //     } catch (error) {
    //         console.error(error); // Log lỗi nếu có
    //     } finally {
    //         setIsLoading(false); // Đảm bảo trạng thái tải được tắt
    //     }
    // };

    const columns = [
        {
          key: '#',
          title: '#',
          dataIndex: 'id',
          render: (text, record, index) => index + 1,
          align: 'center',
          width: 50,
        },
        {
          key: 'method',
          title: 'Method',
          dataIndex: 'method',
        },
        {
          key: 'createdAt',
          title: 'Created At',
          dataIndex: 'createdAt',
          render: (text) => new Date(text).toLocaleString(),
          align: 'center',
          width: 200,
        },
      ];
    
      return (
        <div className="container">
          <Table
          pagination ={{
            // total,
            // pageSize: Limit,
            // current: page,
            // onChange: (page, limit) => {
            //     setPage(page);
            //     setLimit(limit);
            // }
          }}
            columns={columns}
            dataSource={[]} // ✅ Mảng rỗng để test giao diện
            loading={false} // ✅ Không loading
            // dataSource={logs} 
            // loading={isLoading} 
            size="small"
            
          />
        </div>
      );
};

export default Actions;