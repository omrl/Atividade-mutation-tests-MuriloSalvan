const TextoUtils = require("../src/textoUtils");

describe("TextoUtils", () => {
  let utils;

  beforeEach(() => {
    utils = new TextoUtils();
  });

  test("inverter deve inverter a string", () => {
    expect(utils.inverter("abc")).toBe("cba");
  });

  test("ehPalindromo deve identificar palíndromos corretamente", () => {
    expect(utils.ehPalindromo("Arara")).toBe(true);
    expect(utils.ehPalindromo("A base do teto desaba")).toBe(true);
    expect(utils.ehPalindromo("JavaScript")).toBe(false);
  });

  test("capitalizar deve deixar a primeira letra de cada palavra maiúscula", () => {
    expect(utils.capitalizar("olá mundo")).toBe("Olá Mundo");
  });

  test("contarOcorrencias deve contar substrings corretamente", () => {
    expect(utils.contarOcorrencias("banana", "an")).toBe(2);
    expect(utils.contarOcorrencias("banana", "x")).toBe(0);
    expect(utils.contarOcorrencias("banana", "")).toBe(0);
  });

  test("removerEspacosExtras deve limpar espaços extras", () => {
    expect(utils.removerEspacosExtras("  oi   mundo  ")).toBe("oi mundo");
  });

  test("paraSlug deve converter texto em slug", () => {
    expect(utils.paraSlug("Olá Mundo!")).toBe("ola-mundo");
  });

  test("truncar deve truncar textos longos", () => {
    expect(utils.truncar("Texto muito longo", 5)).toBe("Texto...");
    expect(utils.truncar("curto", 10)).toBe("curto");
  });

  test("truncar deve lançar erro para tamanho negativo", () => {
    expect(() => utils.truncar("abc", -1)).toThrow();
  });

  test("contarPalavras deve contar as palavras corretamente", () => {
    expect(utils.contarPalavras("  isso   é   um  teste ")).toBe(4);
  });

  test("somenteLetras deve validar strings só com letras", () => {
    expect(utils.somenteLetras("abcXYZ")).toBe(true);
    expect(utils.somenteLetras("abc123")).toBe(false);
  });

  test("substituirTudo deve substituir todas as ocorrências", () => {
    expect(utils.substituirTudo("gato gato gato", "gato", "cão")).toBe(
      "cão cão cão"
    );
  });

  test("substituirTudo deve lançar erro se alvo for vazio", () => {
    expect(() => utils.substituirTudo("abc", "", "x")).toThrow();
  });

  describe("mutation tests", () => {
    test("capitalizar deve manter espaços duplicados", () => {
      expect(utils.capitalizar("olá  mundo")).toBe("Olá  Mundo");
    });

    test("paraSlug deve ignorar espaços nas pontas e repetidos", () => {
      expect(utils.paraSlug("  Olá   Mundo  ")).toBe("ola-mundo");
    });

    test("truncar deve aceitar tamanho zero", () => {
      expect(utils.truncar("abc", 0)).toBe("...");
    });

    test("truncar não deve alterar texto com tamanho exato", () => {
      expect(utils.truncar("abc", 3)).toBe("abc");
    });

    test("truncar deve informar a mensagem de erro", () => {
      expect(() => utils.truncar("abc", -1)).toThrow(
        "O tamanho não pode ser negativo",
      );
    });

    test("contarPalavras deve retornar zero para texto vazio", () => {
      expect(utils.contarPalavras("")).toBe(0);
      expect(utils.contarPalavras("   ")).toBe(0);
    });

    test("somenteLetras deve recusar números no início", () => {
      expect(utils.somenteLetras("123abc")).toBe(false);
    });

    test("substituirTudo deve informar a mensagem de erro", () => {
      expect(() => utils.substituirTudo("abc", "", "x")).toThrow(
        "O alvo não pode ser vazio",
      );
    });
  });
});