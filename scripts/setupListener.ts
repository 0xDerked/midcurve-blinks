const setupListener = async () => {
    const response = await fetch('http://localhost:3000/api/setupListener', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: 'midcrvh9iKNDjCVJHbXYPx74CJEYyyP8Hco57szu9ps' }),
    })
    const data = await response.json()
    console.log(data.message)
}

setupListener()
