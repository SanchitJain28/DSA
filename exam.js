let inputData = ''

process.stdin.on('data' , (data)=>{
    inputData += data
})

process.stdin.on('end' , ()=>{
    const lines = inputData.trim().split('\n');
    main(lines);
})


function main(lines) {
  const n = Number(lines[0]);
  const nums = lines[1].split(' ').map(Number);

  const result = threeSum(nums);
  result.forEach(triplet => {
    console.log(triplet.join(' '));
  });
}