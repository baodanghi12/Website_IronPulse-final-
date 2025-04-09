import React, { use } from 'react';
import { Card, Divider } from 'antd';
import { data, Link } from 'react-router-dom';
import Statistic from '../components/StatisticComponent';
import { useEffect, useState } from 'react';
import { Table } from 'antd';
const ReportScreen = () => {

    const [totalProfitDatas, setTotalProfitDatas] = React.useState({
        bills: [],
        orders: [],
        revenue: 0,
        profitMonth: Number,
        profitYear: Number,
    });

    const [loadings, setloadings] = useState({
        loadingsTotalProfitDatas: false,
    })

    useEffect(() => {
        getTotalProfitDatas();
    },[]);

    const getTotalProfitDatas = async () => {
        setloadings({ ...loadings, loadingsTotalProfitDatas: true});
        const api = `/admin/total-profit`;
        try {
            
        } catch (error) {
            console.log(error);
        } finally{
            setloadings({ ...loadings, loadingsTotalProfitDatas: false});
        }
    }
    return (
        <div
            style={{
                display: 'flex', // Sử dụng Flexbox để sắp xếp ngang
                gap: '1rem', // Khoảng cách giữa hai Card
                justifyContent: 'space-between', // Khoảng cách đều giữa các Card
                marginTop: '1rem', // Khoảng cách trên
            }}
        >
            {/* Card 1 */}
            <Card
    title="Overviews"
    style={{
        flex: 1, // Đảm bảo Card chiếm cùng một tỷ lệ
    }}
>
    {loadings.loadingsTotalProfitDatas ? (
        <div style={{ textAlign: 'center' }}>
            <Spin />
        </div>
    ) : (
        <>
            <div
                style={{
                    display: 'flex', // Sử dụng Flexbox để sắp xếp ngang
                    justifyContent: 'space-around', // Khoảng cách đều giữa các Statistic
                    alignItems: 'center', // Căn giữa theo chiều dọc
                    width: '100%', // Đảm bảo chiếm toàn bộ chiều ngang
                }}
            >
                <Statistic title="Profit" value={123} />
                <Statistic title="Revenue" value={456} />
                <Statistic title="Order" value={789} />
            </div>
            <Divider />
            <div
                style={{
                    display: 'flex', // Sử dụng Flexbox để sắp xếp ngang
                    justifyContent: 'space-around', // Khoảng cách đều giữa các Statistic
                    alignItems: 'center', // Căn giữa theo chiều dọc
                    width: '100%', // Đảm bảo chiếm toàn bộ chiều ngang
                }}
            >
                <Statistic title="Total Bills" value={789} />
                <Statistic title="Total Orders" value={789} />
                <Statistic title="Profit MOM" value={789} />
                <Statistic title="Profit YOY" value={789} />
            </div>
        </>
    )}
</Card>
            {/* Card 2 */}
            <Card
                title="Best selling categories"
                extra={<Link to={'#'}>See all</Link>}
                style={{
                    flex: 1, // Đảm bảo Card chiếm cùng một tỷ lệ
                     // Đặt chiều cao cố định
                }}
            >
                <Table
                dataSource={''}
                showHeader={false}
                pagination = {{
                    pageSize: 5,
                    hideOnSinglePage: true,

                }}
                columns ={[
                    {
                        key: 'name',
                        title: 'Name',
                        dataIndex: 'title',
                    },
                    {
                        key: 'count',
                        title: 'Count',
                        dataIndex: 'count',
                    },
                    {
                        key: 'total',
                        title: 'Total',
                        dataIndex: 'total',
                        render:(total) => VND.format(total),
                    },

                ]}></Table>
            </Card>
        </div>
    );
};

export default ReportScreen;