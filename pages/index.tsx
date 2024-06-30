import type { GetServerSideProps } from "next";
import { type GetListResponse, useTable } from "@refinedev/core";
import { resources } from "utility";

import ProductCards from "@components/ProductCards";

interface IRecipe {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}
type ItemProp = {
  products: GetListResponse<IRecipe>;
};

const ProductList: React.FC = () => {
  const { tableQueryResult } = useTable<IRecipe>({
    resource: resources.recipes,
  });

  return (
    <div className="my-8 grid grid-cols-4 gap-6 px-24">
      <h1>Munch time</h1>
      {tableQueryResult.data?.data.map((product) => {
        return (
          <ProductCards
            key={product.id}
            title={product.title}
            category={product.category}
            description={product.description}
            cardImage={product.image}
            price={product.price}
          />
        );
      })}
    </div>
  );
};

export default ProductList;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: { products: "data" },
  };
};
