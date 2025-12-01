export const listOrders = async ({ customerName = null, pageNumber = 1, pageSize = 20, status = null } = {}) => {
  const params = {};
  if (customerName) params.customerName = customerName;
  if (status) params.status = status;
  params.pageNumber = pageNumber;
  params.pageSize = pageSize;

  const qs = new URLSearchParams(params).toString();

  const url = qs ? `/api/orders?${qs}` : '/api/orders';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.ok) {
    let data = await response.json();

    // Returned normally from server; no local fallback permitted (orders should be server-stored).

    return { data, error: null };
  } else {
    let error = null;
    try { error = await response.json(); } catch (e) { error = { message: 'Unknown error' }; }

    return { data: null, error, status: response.status };
  }
};

export const postOrder = async (orderData) => {
  const url = '/api/orders';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(orderData),
  });
  const status = response.status;
  if (response.ok) {
    const data = await response.json();
    return { data, error: null, status };
  } else {
    let error = null;
    try { error = await response.json(); } catch (e) { error = { message: 'Unknown error' }; }
    return { data: null, error, status };
  }
};