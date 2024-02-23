import md5 from "md5";

export async function fetchItems(page, filters) {
    const date = new Date();
    const month = date.getUTCMonth() + 1;
    const timestamp = `${date.getUTCFullYear()}${month > 9 ? month : `0${month}`}${date.getUTCDate()}`;
    const password = md5(`Valantis_${timestamp}`);

    let params = {};
    for (const [key, val] of Object.entries(filters)) {
        if (val != null) params[key] = val;
    };

    const isFiltered = Object.keys(params).length > 0;
    const isMultiFilter = Object.keys(params).length > 1;

    const ids = isMultiFilter
    ? await Promise.all(Object.entries(params).map(item => 
        fetch(`http://api.valantis.store:40000/`, {
        method: 'POST',
        headers: {
            'X-Auth': password,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: "filter",
            params: { [item[0]]: item[1] }
        })
    }).then(res => res.json()).then(res => res.result))).then(values => values.reduce((a, b) => a.filter(c => b.includes(c))))
    : await fetch(`http://api.valantis.store:40000/`, {
        method: 'POST',
        headers: {
            'X-Auth': password,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: isFiltered ? "filter" : "get_ids",
            params: { ...params, offset: page * 50, limit: 50}
        })
    }).then(res => res.json())
    .then(res => res.result.slice(
        isFiltered ? 50 * page : 0,
        isFiltered ? 50 * (page + 1) : -1
        )
    )

    console.log(ids)

    // if (!request.ok) {
    //     console.log(request.status);
    //     throw new Error('Fetch ids failed')
    // }

    // const ids = (await request.json()).result.slice(
    //     isFiltered ? 50 * page : 0,
    //     isFiltered ? 50 * (page + 1) : -1);

    const itemsRequest = await fetch(`http://api.valantis.store:40000/`, {
        method: 'POST',
        headers: {
            'X-Auth': password,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: "get_items",
            params: {
                ids
            }
        })
    })

    if (!itemsRequest.ok) {
        console.log(itemsRequest.status);
        throw new Error('Fetch items failed')
    }

    return (await itemsRequest.json()).result.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i);
}