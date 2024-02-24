'use client';
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { fetchItems } from "@/utils/apiFetchHandlers";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import getItems from "@/actions/getItems";

export default function Home() {
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    product: undefined,
    price: undefined,
    brand: undefined
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getItems(offset, filters)
      .then(res => {
        setItems(res);
        setIsLoading(false);
      })
  }, [offset])

  useEffect(() => {
    if (Object.values(filters).every(x => x === undefined)) return;

    const timeout = setTimeout(() => {
      setIsLoading(true);
      getItems(offset, filters)
        .then(res => {
          setItems(res);
          setIsLoading(false);
      })
    }, 1000)

    return () => clearTimeout(timeout);
  }, [filters])

  const handleButtonClick = (isForward) => {
    if (isForward) {
      setOffset(prev => prev + 1);
    }
    else {
      setOffset(prev => prev - 1 >= 0 ? prev - 1 : 0);
    }
  }

  const handleFilterInput = (value, title) => {
    setOffset(0);
    setFilters(prev => ({
      ...prev,
      [title]: value == '' ? null : (title === 'price' ? parseFloat(value) : value)
    }))
  }

  return (
    <main className={styles.main}>
      <fieldset>
        <h2>Valantis Table Items (page #{offset + 1})</h2>
        <input onInput={(e) => handleFilterInput(e.currentTarget.value, 'product')} type="text" placeholder="Введите название товара"/>
        <input onInput={(e) => handleFilterInput(e.currentTarget.value, 'price')} type="number" placeholder="Введите цену товара"/>
        <input onInput={(e) => handleFilterInput(e.currentTarget.value, 'brand')} type="text" placeholder="Введите бренд товара"/>
      </fieldset>
      <table border={1} style={{ backgroundColor: isLoading ? 'gray' : 'transparent'}}>
        <thead>
          <tr style={{ height: '36px' }}>
            <th style={{ width: '35% '}}>Id</th>
            <th style={{ width: '40% '}}>Title</th>
            <th style={{ width: '10% '}}>Price</th>
            <th style={{ width: '15% '}}>Brand</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => 
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.product}</td>
              <td>{item.price}</td>
              <td>{item.brand}</td>
            </tr>  
          )}
        </tbody>
      </table>
      <div className={styles.paginator}>
        <button disabled={isLoading || offset < 1} onClick={() => handleButtonClick(false)}>
          <img style={{ opacity: (isLoading || offset < 1) ? 0.25 : 1}} src="/valantis-test-task/arrow_right_white.svg"/>  
        </button>
        <span>{offset + 1}</span>
        <button disabled={isLoading || items.length < 47} onClick={() => handleButtonClick(true)}>
          <img style={{ opacity: (isLoading || items.length < 47) ? 0.25 : 1}} src="/valantis-test-task/arrow_right_white.svg"/>  
        </button>
      </div>
    </main>
  );
}
