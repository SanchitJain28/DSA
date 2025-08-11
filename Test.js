function RunTest() {
  //TEST HERE
  let testVariable = Array.from({ length: 10 }, (e, index) => index);

  testVariable.forEach((e) => {
    console.log(e);
  });
}

RunTest();
