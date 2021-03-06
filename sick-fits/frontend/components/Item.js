import React from "react";
import Link from "next/link";
import Title from "./styles/Title";
import ItemStyles from "./styles/ItemStyles";
import PriceTag from "./styles/PriceTag";
import formatPrice from "../lib/formatMoney";
import AddToCart from "./AddToCart";
import DeleteItem from "./DeleteItem";

const Item = ({ item }) => (
  <ItemStyles>
    <img src={item.image} alt={item.title} />
    <Title>
      <Link
        href={{
          pathname: "item",
          query: { id: item.id }
        }}
      >
        <a>{item.title}</a>
      </Link>
    </Title>
    <PriceTag>{formatPrice(item.price)}</PriceTag>
    <p>{item.description}</p>
    <div className="buttonList">
      <Link
        href={{
          pathname: "update",
          query: { id: item.id }
        }}
      >
        <a>Edit ✏️</a>
      </Link>
      <AddToCart id={item.id} />
      <DeleteItem id={item.id}>Delete Item ❌</DeleteItem>
    </div>
  </ItemStyles>
);

export default Item;
