import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const BillingHistoryTab = ({ billingHistory, currentPlan }) => {
  const [sortBy, setSortBy] = useState('date_desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'amount_desc', label: 'Amount (High to Low)' },
    { value: 'amount_asc', label: 'Amount (Low to High)' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Invoices' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const getFilteredHistory = () => {
    let filtered = [...billingHistory];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered?.filter(invoice => invoice?.status === filterStatus);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b?.date) - new Date(a?.date);
        case 'date_asc':
          return new Date(a?.date) - new Date(b?.date);
        case 'amount_desc':
          return b?.amount - a?.amount;
        case 'amount_asc':
          return a?.amount - b?.amount;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredHistory = getFilteredHistory();

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20'
    };

    const icons = {
      paid: 'CheckCircle',
      pending: 'Clock',
      failed: 'XCircle'
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-md border ${styles?.[status]}`}>
        <Icon name={icons?.[status]} size={12} />
        <span>{status?.charAt(0)?.toUpperCase() + status?.slice(1)}</span>
      </span>
    );
  };

  const handleDownloadInvoice = (invoice) => {
    // In a real application, this would trigger a download
    console.log('Downloading invoice:', invoice?.id);
  };

  const handleRetryPayment = (invoice) => {
    // In a real application, this would retry the payment
    console.log('Retrying payment for invoice:', invoice?.id);
  };

  if (currentPlan === 'free') {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
            <Icon name="Receipt" size={32} className="text-muted-foreground" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground">No Billing History</h3>
            <p className="text-muted-foreground">
              You're currently on the free plan. Billing history will appear here after your first subscription.
            </p>
          </div>
          
          <Button
            onClick={() => console.log('Navigate to plans')}
            iconName="CreditCard"
          >
            View Subscription Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Billing History</h3>
            <p className="text-sm text-muted-foreground">
              View and download your invoices and payment history
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter by status"
              className="w-40"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
              className="w-40"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => console.log('Export billing history')}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {filteredHistory?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Invoice</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Payment Method</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHistory?.map((invoice) => (
                <tr key={invoice?.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-sm">#{invoice?.id?.toUpperCase()}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">
                      {new Date(invoice?.date)?.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-foreground">{invoice?.description}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="CreditCard" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {invoice?.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">
                      ₹{invoice?.amount?.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(invoice?.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {invoice?.status === 'paid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoice(invoice)}
                          iconName="Download"
                        />
                      )}
                      {invoice?.status === 'failed' && (
                        <Button
                          size="sm"
                          onClick={() => handleRetryPayment(invoice)}
                          iconName="RefreshCw"
                        >
                          Retry
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => console.log('View invoice details:', invoice?.id)}
                        iconName="Eye"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No billing history found</h3>
          <p className="text-muted-foreground">
            {filterStatus !== 'all' ?'Try adjusting your filter criteria' :'Your billing history will appear here after your first payment'
            }
          </p>
        </div>
      )}

      {/* Billing Information */}
      <div className="p-6 border-t border-border bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start space-x-3">
            <Icon name="CreditCard" size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Secure Payments</p>
              <p className="text-muted-foreground">All transactions are encrypted and secure</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="RefreshCw" size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Auto-Renewal</p>
              <p className="text-muted-foreground">Your subscription renews automatically</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Money Back Guarantee</p>
              <p className="text-muted-foreground">30-day money back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHistoryTab;