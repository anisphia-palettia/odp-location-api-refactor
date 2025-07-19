-- CreateTable
CREATE TABLE "group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinate" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT,
    "long" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "group_id" INTEGER,
    "address" TEXT,
    "url_id" TEXT,

    CONSTRAINT "coordinate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "error_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_chat_id_key" ON "group"("chat_id");

-- AddForeignKey
ALTER TABLE "coordinate" ADD CONSTRAINT "coordinate_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
