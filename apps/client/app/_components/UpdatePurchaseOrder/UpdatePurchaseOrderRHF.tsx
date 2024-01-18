import React, { useEffect } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import { PurchaseOrder } from '../../purchase-orders/page'; // Adjust the import path as needed
import { useUpdatePurchaseOrder } from '../../_hooks/useUpdatePurchaseOrder'; // Adjust the import path as needed

interface UpdatePurchaseOrderFormProps {
  id: string;
  purchaseOrder: PurchaseOrder;
}

const UpdatePurchaseOrderForm: React.FC<UpdatePurchaseOrderFormProps> = ({ id, purchaseOrder }) => {
  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm();
  const updatePurchaseOrder = useUpdatePurchaseOrder();

  useEffect(() => {
    if (purchaseOrder) {
    purchaseOrder.purchase_order_line_items.forEach((lineItem, index) => {
      register(`purchase_order_line_items.${index}.id`)
      setValue(`purchase_order_line_items.${index}.id`, lineItem.id);
    });
    }
    }, [purchaseOrder, setValue, register]);

    const onSubmit = async (data: FieldValues) => {
      if (purchaseOrder) {
        const updatedData: PurchaseOrder = {
          ...purchaseOrder,
          ...data,
          order_date: new Date(data.order_date),
          expected_delivery_date: new Date(data.expected_delivery_date),
          purchase_order_line_items: purchaseOrder.purchase_order_line_items.map((lineItem, index) => {
            const updatedLineItemData = data.purchase_order_line_items[index];
            return {
              ...lineItem,
              quantity: updatedLineItemData ? parseInt(updatedLineItemData.quantity) : lineItem.quantity,
              unit_cost: updatedLineItemData ? parseFloat(updatedLineItemData.unit_cost) : lineItem.unit_cost,
            };
          }),
        };
      
        updatePurchaseOrder.mutate({ id, updatedData });
      }
    };

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  if (!purchaseOrder) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-2">
        <label className="block text-md" htmlFor="vendorName">Vendor Name:</label>
          <input
          id="vendorName"
          defaultValue={purchaseOrder.vendor_name}
          {...register("vendor_name", { required: "Vendor name is required" })}
          />
          {errors.vendor_name && <p>{errors.vendor_name.message?.toString()}</p>}
      </div>

      <div className="mb-2">
      <label className="block text-md" htmlFor="orderDate">Order Date:</label>
      <input
        type="date"
        id="orderDate"
        defaultValue={formatDate(purchaseOrder.order_date)}
        {...register("order_date", { required: "Order date is required" })}
      />
      {errors.order_date && <p>{errors.order_date.message?.toString()}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-md" htmlFor="expectedDeliveryDate">Expected Delivery Date:</label>
        <Controller
          name="expected_delivery_date"
          control={control}
          rules={{
            required: "Expected delivery date is required",
            validate: value => value >= getValues("order_date") || "Expected delivery must be on or past the order date"
          }}
          render={({ field }) => <input type="date" id="expectedDeliveryDate" {...field} />}
        />
        {errors.expected_delivery_date && <p>{errors.expected_delivery_date.message?.toString()}</p>}
      </div>

      <div className="mb-6">
        <h3 className="text-lg underline mb-2">Line Items:</h3>
        {purchaseOrder.purchase_order_line_items.map((lineItem, index) => (
          <div className="mb-4" key={lineItem.id}>
            <label className="block text-md" htmlFor={`item_${index}_quantity`}>
              <span className="block underline">
                Item {lineItem.item_id}
              </span>
              <span>
                Quantity:
              </span>
            </label>
            <input
              id={`item_${index}_quantity`}
              type="number"
              defaultValue={lineItem.quantity}
              {...register(`purchase_order_line_items.${index}.quantity`)}
            />
            <label className="block text-md" htmlFor={`item_${index}_unit_cost`}>Unit Cost:</label>
            <input
              id={`item_${index}_unit_cost`}
              type="number"
              defaultValue={lineItem.unit_cost}
              step="0.01"
              {...register(`purchase_order_line_items.${index}.unit_cost`)}
            />
          </div>
        ))}
      </div>

      <button className="bg-white px-2 rounded-md mb-2" type="submit">Update Purchase Order</button>
    </form>
  );
};

export default UpdatePurchaseOrderForm;
