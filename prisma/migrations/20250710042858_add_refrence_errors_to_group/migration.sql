-- AlterTable
ALTER TABLE "error" ADD COLUMN     "group_id" INTEGER;

-- AddForeignKey
ALTER TABLE "error" ADD CONSTRAINT "error_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
