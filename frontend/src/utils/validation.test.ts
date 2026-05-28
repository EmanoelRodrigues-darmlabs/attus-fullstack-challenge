import { describe, expect, it } from "vitest";
import {
  emptyTicketForm,
  validateBusinessRules,
  validateRequiredFields,
  validateTicket
} from "./validation";

describe("validateTicket", () => {
  it("returns errors for required fields", () => {
    const errors = validateRequiredFields(emptyTicketForm);

    expect(errors.title).toBeDefined();
    expect(errors.storeCode).toBeDefined();
    expect(errors.requesterName).toBeDefined();
    expect(errors.description).toBeDefined();
  });

  it("prioritizes required fields before business rules", () => {
    const errors = validateTicket({
      ...emptyTicketForm,
      storeCode: "UN-1024",
      requesterName: "Mariana Silva",
      description: "curta"
    });

    expect(errors.title).toBeDefined();
    expect(errors.description).toBeUndefined();
  });

  it("returns business rule errors after required fields are filled", () => {
    const errors = validateBusinessRules({
      title: "Doc",
      storeCode: "UN-1024-COM-CODIGO-LONGO",
      requesterName: "Mariana Silva",
      category: "SYSTEM_ACCESS",
      priority: "HIGH",
      description: "curta",
      customerImpact: true
    });

    expect(errors.title).toBe("O título deve ter pelo menos 5 caracteres.");
    expect(errors.storeCode).toBe("O código da unidade deve ter no máximo 20 caracteres.");
    expect(errors.description).toBe("A descrição deve ter pelo menos 15 caracteres.");
  });

  it("accepts a valid ticket", () => {
    const errors = validateTicket({
      title: "Acesso ao sistema bloqueado",
      storeCode: "UN-1024",
      requesterName: "Mariana Silva",
      category: "SYSTEM_ACCESS",
      priority: "HIGH",
      description: "Equipe não consegue acessar o módulo desde a abertura.",
      customerImpact: true
    });

    expect(errors).toEqual({});
  });
});
