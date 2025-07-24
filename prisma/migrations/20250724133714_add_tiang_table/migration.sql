-- AlterTable
ALTER TABLE "coordinate" ADD COLUMN     "tiangId" INTEGER;

-- AlterTable
ALTER TABLE "error" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Tiang" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Tiang_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "coordinate" ADD CONSTRAINT "coordinate_tiangId_fkey" FOREIGN KEY ("tiangId") REFERENCES "Tiang"("id") ON DELETE SET NULL ON UPDATE CASCADE;
