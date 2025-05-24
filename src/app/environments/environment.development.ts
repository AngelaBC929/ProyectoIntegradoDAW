export const environment = {
    production: false,
    API_URL: "http://expresscapturevz.wuaze.com/servicios.php", // Cambia esta URL según tu estructura
    jsonEquals: function (a: any, b: any) {
        return JSON.stringify(a) == JSON.stringify(b);
    },
    SeleccionarObj: function (lista: object[], obj: object) {
        var res;
        lista.forEach(valor => {
            if (environment.jsonEquals(valor, obj))
                res = valor;
        });
    },
    SeleccionarObjArray: function (lista: Array<object>, objE: Array<object>) {
        var res = new Array();
        objE.forEach(ele => {
            lista.forEach(valor => {
                if (environment.jsonEquals(valor, ele))
                    res.push(valor);
            })
        });
        return res;
    }
};
