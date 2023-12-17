document.getElementById('nutrientsForm').addEventListener('submit', function (event) {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ

    //* 入力値を取得
    const minProtein = document.getElementById('minProtein').value;
    const maxProtein = document.getElementById('maxProtein').value;
    const minFat = document.getElementById('minFat').value;
    const maxFat = document.getElementById('maxFat').value;
    const minCarbs = document.getElementById('minCarbs').value;
    const maxCarbs = document.getElementById('maxCarbs').value;
    const minCalories = document.getElementById('minCalories').value;
    const maxCalories = document.getElementById('maxCalories').value;

    //* 1日分の数値を朝昼晩用に分割
    //? リクエストが1ptで結果表示が0.1ptなので費用を安くするためにもっと適した設計ができそう
    // 分割のための関数
    const calculatePortions = (value) => {
        return {
            breakfast: value * 0.3,
            lunch: value * 0.4,
            dinner: value * 0.3
        };
    };
    // 各栄養素を分割
    const minProteinPortions = calculatePortions(minProtein);
    const maxProteinPortions = calculatePortions(maxProtein);
    const minFatPortions = calculatePortions(minFat);
    const maxFatPortions = calculatePortions(maxFat);
    const minCarbsPortions = calculatePortions(minCarbs);
    const maxCarbsPortions = calculatePortions(maxCarbs);
    const minCaloriesPortions = calculatePortions(minCalories);
    const maxCaloriesPortions = calculatePortions(maxCalories);

    //* APIリクエストの作成
    const apiUrlBreakfast = `https://api.spoonacular.com/recipes/findByNutrients?apiKey=XXX&minProtein=${minProteinPortions.breakfast}&maxProtein=${maxProteinPortions.breakfast}&minFat=${minFatPortions.breakfast}&maxFat=${maxFatPortions.breakfast}&minCarbs=${minCarbsPortions.breakfast}&maxCarbs=${maxCarbsPortions.breakfast}&minCalories=${minCaloriesPortions.breakfast}&maxCalories=${maxCaloriesPortions.breakfast}&number=7`;
    const apiUrlLunch = `https://api.spoonacular.com/recipes/findByNutrients?apiKey=XXX&minProtein=${minProteinPortions.lunch}&maxProtein=${maxProteinPortions.lunch}&minFat=${minFatPortions.lunch}&maxFat=${maxFatPortions.lunch}&minCarbs=${minCarbsPortions.lunch}&maxCarbs=${maxCarbsPortions.lunch}&minCalories=${minCaloriesPortions.lunch}&maxCalories=${maxCaloriesPortions.lunch}&number=7`;
    const apiUrlDinner = `https://api.spoonacular.com/recipes/findByNutrients?apiKey=XXX&minProtein=${minProteinPortions.dinner}&maxProtein=${maxProteinPortions.dinner}&minFat=${minFatPortions.dinner}&maxFat=${maxFatPortions.dinner}&minCarbs=${minCarbsPortions.dinner}&maxCarbs=${maxCarbsPortions.dinner}&minCalories=${minCaloriesPortions.dinner}&maxCalories=${maxCaloriesPortions.dinner}&number=7`;
    // URLの確認
    console.log(apiUrlBreakfast);
    console.log(apiUrlLunch);
    console.log(apiUrlDinner);

    //*結果を1週間分の献立として表示 
    // APIレスポンスを処理し、レシピを表示する関数
    function fetchAndDisplayMeals(apiUrl, mealType) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(recipes => {
                // データを日ごとに分配して表示
                recipes.forEach((recipe, index) => {
                    const day = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index];
                    const recipeElement = document.createElement('div');
                    recipeElement.innerHTML = `
                    <h3>${day.toUpperCase()}: ${recipe.title}</h3>
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <p>Calories: ${recipe.calories}</p>
                    <p>Carbs: ${recipe.carbs}</p>
                    <p>Fat: ${recipe.fat}</p>
                    <p>Protein: ${recipe.protein}</p>
                `;
                    document.querySelector(`.${day}Plan`).appendChild(recipeElement);
                });
            })
            .catch(error => console.error('Error:', error));
    }
    // 朝食、昼食、夕食用のAPIリクエストを実行
    fetchAndDisplayMeals(apiUrlBreakfast, 'breakfast');
    fetchAndDisplayMeals(apiUrlLunch, 'lunch');
    fetchAndDisplayMeals(apiUrlDinner, 'dinner');

});