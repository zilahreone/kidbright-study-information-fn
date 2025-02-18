const add = (x: string, y: string): string => {
  return `${x}${y}`
}

const fetchAPI = async (method: 'GET' | 'POST' | 'DELETE' | 'PATCH', endpoint: string, token?: string, body?: Object): Promise<any> => {
  const response = await fetch(endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(['PUT', 'POST', 'PATCH'].includes(method) && { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    throw new Response(response.statusText, { status: response.status });
  }
  return await response.json();
}

export { add, fetchAPI }