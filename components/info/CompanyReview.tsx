import { Company } from '@/types/salon';

interface CompanyReviewProps {
    company: Company;
}

export default function CompanyReview({ company }: CompanyReviewProps) {
    return (
        <h1>
            review tab demo
        </h1>
    );
}