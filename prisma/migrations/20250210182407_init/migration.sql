-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_reservedBy_fkey" FOREIGN KEY ("reservedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
