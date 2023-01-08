const data = [
    {
        user: 1,
        text: "Salom"
    },
    {
        user: 2,
        text: "Salom2"
    },
    {
        user: 3,
        text: "Salom3"
    },
    {
        user: 4,
        text: "Salom2"
    },
    {
        user: 5,
        text: "Salom3"
    },
    {
        user: 6,
        text: "Salom2"
    },
    {
        user: 7,
        text: "Salom3"
    }
]


const sortabel = (arr, arr2) =>{
    const newdata = []
    arr2.forEach(element => {
        const ss = arr.filter(data => data.text == element)
        newdata.push({text: element, count: ss.length})
    });
    return newdata;
}

module.exports = {sortabel};

// console.log(sortabel(data, ["Salom", "Salom2", "Salom3"]))