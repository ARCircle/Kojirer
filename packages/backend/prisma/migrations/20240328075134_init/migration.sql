-- CreateTable
CREATE TABLE "adding" (
    "dons_id" BIGINT NOT NULL,
    "toppings_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "adding_pkey" PRIMARY KEY ("dons_id","toppings_id")
);

-- CreateTable
CREATE TABLE "dons" (
    "id" BIGSERIAL NOT NULL,
    "size_id" INTEGER NOT NULL,
    "order_id" BIGINT NOT NULL,
    "status" INTEGER NOT NULL,
    "vegetables" INTEGER NOT NULL,
    "garlic" INTEGER NOT NULL,
    "karame" INTEGER NOT NULL,
    "abura" INTEGER NOT NULL,
    "sns_followed" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "call_num" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(255) NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "size_prices" (
    "id" SERIAL NOT NULL,
    "size_id" INTEGER NOT NULL,

    CONSTRAINT "size_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toppings" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR NOT NULL,
    "available" BOOLEAN DEFAULT true,

    CONSTRAINT "toppings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topping_prices" (
    "id" SERIAL NOT NULL,
    "topping_id" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topping_prices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "adding" ADD CONSTRAINT "adding_dons_id_fkey" FOREIGN KEY ("dons_id") REFERENCES "dons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adding" ADD CONSTRAINT "adding_toppings_id_fkey" FOREIGN KEY ("toppings_id") REFERENCES "toppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dons" ADD CONSTRAINT "dons_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dons" ADD CONSTRAINT "dons_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "size_prices" ADD CONSTRAINT "size_prices_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topping_prices" ADD CONSTRAINT "topping_prices_topping_id_fkey" FOREIGN KEY ("topping_id") REFERENCES "toppings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
