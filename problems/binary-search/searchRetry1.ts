function searchRetry1(nums: number[], target: number): number {
  //? let's find out the minimum element in this array
  if (nums.length === 0) return -1;
  let left = 0 
  let right = nums.length - 1
  while(left < right){
    let mid = left + Math.floor((right - left) /2 )
    if(nums[mid] > nums[right]){
      left = mid + 1
    }else {
      right = mid
    }
  }
  let pivot = left 
  left = 0 
  right = nums.length - 1
  //let's find the correct half
  if(target <=nums[right]){
    left = pivot
  } else {
    right = pivot - 1
  }

  // now let's apply the binary search to find the element
  while(left <=right){
    let mid = left + Math.floor((right -left)/2)
    if(nums[mid] === target){
      return mid
    }else if(nums[mid] > target){
      right = mid - 1
    } else {
      left = mid + 1
    }
  }
  return -1
}
