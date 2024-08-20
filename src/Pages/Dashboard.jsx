import {
  MenuFoldOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import Spinner from "../Spinner.gif";
import { Table, Tag } from "antd";
import { Button, Layout, Menu, theme } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Barcode from "jsbarcode-react";

const { Header, Sider, Content } = Layout;

const Dashboard = ({ orders, loading }) => {
  const [csv, setCSV] = useState([]);
  const [items, setItems] = useState([]);
  const [show, setshow] = useState(false);
  const [newdata, setnewData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState("Filter Status");
  const [day, setDay] = useState("Today");
  const navigate = useNavigate();
  const [loading2, setLoading2] = useState(true);
  const [ss, setSs] = useState("");

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const columns2 = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Sold Quantity",
      dataIndex: "qty",
      key: "qty",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Available Quantity",
      dataIndex: "available",
      key: "available",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "ML code",
      dataIndex: "code",
      key: "code",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
      render: (text) => <a>{text}</a>,
    },
  ];

  const columns = [
    {
      title: "Order Id",
      dataIndex: "orderid",
      key: "orderid",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      key: "buyer",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = "";
            if (tag.toUpperCase() === "PAID") {
              color = "green";
            } else if (tag.toUpperCase() === "NOT_DELIVERED") {
              color = "volcano";
            } else {
              color = "geekblue";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const getyesterday = (e) => {
    setDay(e);
    const day =
      (new Date().getUTCDate() - 1).toString().length === 1
        ? "0" + (new Date().getUTCDate() - 1)
        : new Date().getUTCDate() - 1;
    const month =
      (new Date().getMonth() + 1).toString().length === 1
        ? `0${new Date().getMonth() + 1}`
        : Number(new Date().getMonth() + 1);
    const year = new Date().getUTCFullYear();

    const yesorders = orders.filter((elem) => {
      return (
        // elem.tags.includes("delivered") &&
        elem.date_created.split("-")[2].split("")[0] +
        "" +
        elem.date_created.split("-")[2].split("")[1] +
        "-" +
        elem.date_created.split("-")[1] +
        "-" +
        elem.date_created.split("-")[0] ==
        day + "-" + month + "-" + year && elem.status !== "cancelled"
      );
    });
    setCSV(yesorders);
    setnewData(yesorders);
  };

  const DeliveredOrderPerDay = (e) => {
    // if (ss !== "All") {
    const day =
      new Date().getUTCDate().toString().length === 1
        ? "0" + new Date().getUTCDate()
        : new Date().getUTCDate();

    const month =
      (new Date().getMonth() + 1).toString().length === 1
        ? `0${new Date().getMonth() + 1}`
        : Number(new Date().getMonth() + 1);
    const year = new Date().getUTCFullYear();

    const neworders = orders.filter((elem) => {
      return (
        // elem.tags.includes("delivered") &&
        elem.date_created.split("-")[2].split("")[0] +
        "" +
        elem.date_created.split("-")[2].split("")[1] +
        "-" +
        elem.date_created.split("-")[1] +
        "-" +
        elem.date_created.split("-")[0] ==
        day + "-" + month + "-" + year && elem.status !== "cancelled"
      );
    });
    // console.log(neworders);
    if (ss !== "All") {
      setCSV(neworders);
    }
    setnewData(neworders);
    // }
  };

  const getBack = (e, i) => {
    setDay(e);
    const today = new Date();

    // Calculate the date two days ago
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - i);

    const year = twoDaysAgo.getFullYear();
    const month =
      String(twoDaysAgo.getMonth() + 1).length === 1
        ? String(twoDaysAgo.getMonth() + 1).padStart(i, "0")
        : String(twoDaysAgo.getMonth() + 1);
    const day =
      String(twoDaysAgo.getDate()).length === 1
        ? String(twoDaysAgo.getDate()).padStart(i, "0")
        : String(twoDaysAgo.getDate());

    const neworders = orders.filter((elem) => {
      return (
        // elem.tags.includes("delivered") &&
        elem.date_created.split("-")[2].split("")[0] +
        "" +
        elem.date_created.split("-")[2].split("")[1] +
        "-" +
        elem.date_created.split("-")[1] +
        "-" +
        elem.date_created.split("-")[0] ==
        `${day}-${month}-${year}` && elem.status !== "cancelled"
      );
    });
    setCSV(neworders);
    setnewData(neworders);
  };

  const data2 = [
    ...items.map((elem) => {
      return {
        key: elem.seller_sku,
        sku: elem.seller_sku,
        item: elem.title,
        qty: elem.sold_quantity,
        available: elem.available_quantity,
        code: elem.id,
        label: (
          <Barcode
            value={elem.id}
            height={90}
            renderer="image"
            className="barcode"
          />
        ),
      };
    }),
  ];

  const data = [
    ...newdata.map((elem) => {
      const sku = elem.order_items[0].item?.seller_sku;
      return {
        key: elem.id,
        date:
          elem.date_created.split("-")[2].split("")[0] +
          "" +
          elem.date_created.split("-")[2].split("")[1] +
          "-" +
          elem.date_created.split("-")[1] +
          "-" +
          elem.date_created.split("-")[0],
        orderid: elem.pack_id ? elem.pack_id : elem.id,
        buyerid: elem.buyer?.id,
        sku: sku,
        buyer: elem.buyer?.nickname,
        amount: elem.payments[0].transaction_amount,
        product: elem.order_items[0].item?.title,
        tags: [...elem.tags],
        status: elem.status.toUpperCase(),
      };
    }),
  ];

  const CSVdata = [
    ...csv.map((elem) => {
      return {
        SKU: elem.order_items[0].item?.seller_sku,
        OrderNumber: "",
        OrderStatus: elem.status === "paid" ? "Paid" : elem.status,
        Customer: elem.buyer?.nickname,
        ContactName: "",
        Phone: "",
        Email: "",
        BillingAddress1: "",
        BillingAddress2: "",
        BillingCity: "",
        BillingState: "",
        BillingCountry: "",
        BillingPostalCode: "",
        BillingAddressRemarks: "",
        ShipToCompanyName: "",
        ShippingAddress1: "",
        ShippingAddress2: "",
        ShippingCity: "",
        ShippingState: "",
        ShippingCountry: "",
        ShippingPostalCode: "",
        ShippingAddressRemarks: "",
        CurrencyCode: "",
        ExchangeRate: "",
        OrderDate:
          elem.date_created.split("-")[1] +
          "-" +
          elem.date_created.split("-")[2].split("")[0] +
          "" +
          elem.date_created.split("-")[2].split("")[1] +
          "-" +
          elem.date_created.split("-")[0] +
          "",
        OrderRemarks: "",
        Freight: "",
        InvoicedDate: "",
        DueDate: "",
        DatePaid: "",
        AmountPaid: elem.total_amount,
        RequestedShipDate: "",
        PONumber: `=""${elem.pack_id ? elem.pack_id : elem.id}""`,
        SalesRep: "Bot",
        Location: "MercadoLibre",
        PricingScheme: "MercadoLibre",
        PaymentTerms: "Mercado Pago",
        PaymentMethod: "Mercado Pago",
        TaxingScheme: "",
        Tax1Rate: "",
        Tax2Rate: "",
        CalculateTax2OnTax1: "",
        Tax1Name: "",
        Tax2Name: "",
        TaxOnShipping: "",
        Custom1: "",
        Custom2: "",
        Custom3: "",
        ItemName: elem.order_items[0].item?.title,
        ItemDescription: "",
        ItemQuantity: elem.order_items[0].quantity,
        ItemUnitPrice: elem.order_items[0].unit_price,
        ItemDiscount: "",
        ItemSubtotal:
          elem.order_items[0].unit_price * elem.order_items[0].quantity,
        ItemTaxCode: "",
      };
    }),
  ];

  const csvdata2 = [
    ...items.map((elem) => {
      return {
        sku: elem.seller_sku,
        item: elem.title,
        qty: elem.sold_quantity,
        code: elem.id,
        available: elem.available_quantity,
        // label:  <Barcode value={elem.id} height={90} />
      };
    }),
  ];

  const collectOrderNumbers = [
    2000009079841222,
    2000006199060329,
    2000009079230764,
    2000006198441873,
    2000006198159045,
    2000009077868278,
    2000009076934070,
    2000009076261002,
    2000006196820187,
    2000009072404018,
    2000006195034877,
    2000006199886511,
    2000009081161248,
    2000006199851837,
    2000006199815105,
    2000006199784253,
    2000009077992396,
    2000006199744357,
    2000006199651015,
  ];

  const tagCollectOrders = (orders) => {
    return orders.map(order => {
      if (collectOrderNumbers.includes(order.id)) {
        if (!order.tags.includes("collect")) {
          return { ...order, tags: [...order.tags, "collect"] };
        }
      }
      return order;
    });
  };

  const FilterStatus = (status) => {
    if (status === "All") {
      setSs("All");
      setCSV(orders);
      setnewData(orders);
      setFilter(status);
    } else if (status === "Fulfilled") {
      setSs("All");
      const fulfilledOrders = orders
        .filter(order => !order.tags.includes("not_delivered")) // Exclude orders with the "not_delivered" tag
        .filter(order => order.fulfilled !== null); // Include only fulfilled orders
      setCSV(fulfilledOrders);
      setnewData(fulfilledOrders);
      setFilter(status);
    } else if (status === "Collect") {
      setSs("All");
      const ordersWithCollectTag = tagCollectOrders(orders);
      const collectOrders = ordersWithCollectTag.filter(order => order.tags.includes("collect"));
      console.log(collectOrders);
      setCSV(collectOrders);
      setnewData(collectOrders);
      setFilter(status);
    } else {
      setSs("All");
      const filtered = orders.filter(elem => elem.status === status.toLowerCase());
      setCSV(filtered);
      setnewData(filtered);
      setFilter(status);
    }
  };


  useEffect(() => {
    DeliveredOrderPerDay("");
  }, [orders]);

  useEffect(() => {
    setLoading2(true);
    const date1 =
      new Date().getFullYear() +
      "-" +
      ((new Date().getMonth() + 1).toString().length === 1
        ? "0" + (new Date().getMonth() + 1)
        : +(new Date().getMonth() + 1)) +
      "-" +
      new Date().getUTCDate();
    const date2 =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth().toString().length === 1
        ? "0" + new Date().getMonth()
        : +new Date().getMonth()) +
      "-" +
      new Date().getUTCDate();

    axios
      .post(process.env.REACT_APP_BASE_URL + "/api/orders/getitems", {
        pass: process.env.REACT_APP_PASSWORD,
        date1,
        date2,
      })
      .then((response) => {
        // console.log(response.data);
        const d = response.data.processedData;
        setItems(d);
        setLoading2(false);
      });
  }, []);

  // console.log(items);

  // console.log(orders);

  if (localStorage.getItem("pass") !== process.env.REACT_APP_PASSWORD)
    return <Navigate to={"/login"} />;

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        {!collapsed && (
          <img
            src="https://cdn.shopify.com/s/files/1/0327/2828/5316/files/Flexcop_360x.png?v=1613519161"
            alt="logo"
            height={45}
            className="d-block mx-auto mt-3"
            style={{ filter: "invert(100%)" }}
          />
        )}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="mt-4"
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Orders",
              onClick: () => setshow(false),
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Items Sold",
              onClick: () => setshow(true),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="d-flex justify-content-between align-items-center"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <button
            className="btn btn-danger me-3"
            onClick={() => {
              localStorage.removeItem("pass");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 112px)",
            background: colorBgContainer,
          }}
        >
          {!show && (
            <div className="d-flex align-items-center justify-content-between">
              <div className="dropdown">
                <button
                  className="btn border px-3 dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {filter}
                </button>
                <ul className="dropdown-menu">
                  <li
                    className="dropdown-item"
                    onClick={() => FilterStatus("All")}
                    type="button"
                  >
                    All
                  </li>
                  <li
                    className="dropdown-item"
                    type="button"
                    onClick={(e) => FilterStatus(e.target.innerText)}
                  >
                    Fulfilled
                  </li>
                  <li
                    className="dropdown-item"
                    type="button"
                    onClick={(e) => FilterStatus(e.target.innerText)}
                  >
                    Collect
                  </li>
                  <li
                    className="dropdown-item"
                    type="button"
                    onClick={(e) => FilterStatus(e.target.innerText)}
                  >
                    Paid
                  </li>
                  <li
                    type="button"
                    className="dropdown-item"
                    onClick={(e) => FilterStatus(e.target.innerText)}
                  >
                    Cancelled
                  </li>
                </ul>
              </div>

              <div className="d-flex mt-2">
                <div className="dropdown">
                  <button
                    className="btn border px-3 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {day}
                  </button>
                  <ul className="dropdown-menu">
                    <li
                      className="dropdown-item"
                      onClick={(e) => {
                        setSs("")
                        setDay(e.target.innerText);
                        DeliveredOrderPerDay("");
                      }}
                    >
                      Today
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={(e) => getyesterday(e.target.innerText)}
                    >
                      Yesterday
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={(e) => getBack(e.target.innerText, 2)}
                    >
                      3 Day
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={(e) => getBack(e.target.innerText, 3)}
                    >
                      4 Day
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={(e) => getBack(e.target.innerText, 4)}
                    >
                      5 Day
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={(e) => getBack(e.target.innerText, 5)}
                    >
                      6 Day
                    </li>
                  </ul>
                </div>
                <CSVLink
                  data={CSVdata.length > 0 ? CSVdata : "No orders"}
                  className="btn btn-primary ms-3"
                  filename="inFlow_SalesOrder"
                  disabled={loading}
                >
                  Download CSV
                </CSVLink>
              </div>
            </div>
          )}

          {show && (
            <CSVLink
              data={csvdata2.length > 0 ? csvdata2 : "No orders"}
              className="btn btn-primary"
              filename="inFlow_SalesOrder"
              disabled={loading}
            >
              Download CSVV
            </CSVLink>
          )}
          <p className="mt-2">
            Showing{" "}
            {!show
              ? newdata.length + " orders"
              : items.length + " products sold"}
          </p>
          {loading && (
            <img src={Spinner} height={100} className="d-block mx-auto" />
          )}
          {!show && !loading && (
            <Table columns={columns} dataSource={data} className="mt-0" />
          )}

          {show && !loading2 && !loading && (
            <Table columns={columns2} dataSource={data2} className="mt-0" />
          )}

          {show && loading2 && (
            <img src={Spinner} height={100} className="d-block mx-auto" />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
