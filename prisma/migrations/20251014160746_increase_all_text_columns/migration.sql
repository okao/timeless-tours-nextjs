-- AlterTable
ALTER TABLE `CompanyValue` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Faq` MODIFY `question` TEXT NOT NULL,
    MODIFY `answer` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `FaqTopic` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `TeamMember` MODIFY `bio` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `TourI18n` MODIFY `shortDescription` TEXT NULL,
    MODIFY `fullDescription` TEXT NULL;
