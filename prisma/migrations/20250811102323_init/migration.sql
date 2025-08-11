-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chat_code" TEXT NOT NULL,
    "show" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinates" (
    "id" SERIAL NOT NULL,
    "image_name" TEXT,
    "lng" DECIMAL(9,6) NOT NULL,
    "lat" DECIMAL(9,6) NOT NULL,
    "address" TEXT,
    "photo_code" TEXT,
    "is_accepted" BOOLEAN,
    "photo_taken_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "group_id" INTEGER,
    "pole_id" INTEGER,

    CONSTRAINT "coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "errors" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "group_id" INTEGER,

    CONSTRAINT "errors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "poles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_chat_code_key" ON "groups"("chat_code");

-- CreateIndex
CREATE INDEX "coordinates_group_id_idx" ON "coordinates"("group_id");

-- CreateIndex
CREATE INDEX "coordinates_pole_id_idx" ON "coordinates"("pole_id");

-- CreateIndex
CREATE INDEX "errors_group_id_idx" ON "errors"("group_id");

-- AddForeignKey
ALTER TABLE "coordinates" ADD CONSTRAINT "coordinates_pole_id_fkey" FOREIGN KEY ("pole_id") REFERENCES "poles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinates" ADD CONSTRAINT "coordinates_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "errors" ADD CONSTRAINT "errors_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
