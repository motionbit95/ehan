//import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./pages/AD/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/CS/home";
import Cart from "./pages/CS/cart";
import Payment from "./pages/CS/payment";
import Result from "./pages/CS/result";
import Account from "./pages/AD/account";
import Order from "./pages/AD/order";
import Income from "./pages/AD/income";
import Product from "./pages/AD/product";
import Menu from "./pages/CS/menu";
import Login from "./pages/AD/login";
import { Center, Container } from "@chakra-ui/react";

function App() {
  // url 주소에 admin이 포함되어있으면 관리자 페이지입니다.
  const isAdmin = window.location.pathname.includes("admin");
  return (
    <Center>
      <Container
        w={"100%"}
        maxW={isAdmin ? "100%" : "700px"}
        bgColor={"#d9d9d9"}
        minH={"100vh"}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/home/*" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/result" element={<Result />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/account" element={<Account />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/order" element={<Order />} />
            <Route path="/admin/income" element={<Income />} />
            <Route path="/admin/product" element={<Product />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </Center>
  );
}

export default App;
