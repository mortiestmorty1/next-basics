import Form from '@/app/ui/invoices/create-form';
import { fetchCustomers } from '@/app/lib/data';
 
export default async function Page() {
  const customers = await fetchCustomers();
 
  return (
    <main>
      <div className="mb-8 flex w-full items-center justify-between">
        <h1 className="text-2xl">Create Invoice</h1>
      </div>
      <Form customers={customers} />
    </main>
  );
}