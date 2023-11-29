const deleteItem = document.querySelectorAll('.deleteButton')

Array.from(deleteItem).forEach(element => {element.addEventListener('click', deleteRequest)})

async function deleteRequest() {
    const courseTitle = this.parentNode.parentNode.children[1].innerText
    try {
        const response = await fetch('deleteCourse', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                courseTitle: courseTitle
            }),
          })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(error) {
        console.log(error)
    }
}