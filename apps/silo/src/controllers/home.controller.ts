import { Request, Response } from "express";
import * as Sentry from "@sentry/node";

export class HomeController {
  /**
   * Health check endpoint used by uptime monitors / load balancers.
   *
   * NOTE: This route previously always threw a hardcoded
   * "Test error for sentry instrumentation" error to verify that Sentry was
   * wired up correctly. That test error was never gated behind an
   * environment check, so every ping request (including production health
   * checks) ended up throwing and being reported to Sentry as a real
   * incident.
   *
   * The test error can now only be triggered intentionally, in non
   * production environments, by passing `?triggerTestError=true` on the
   * request. Regular health check requests will respond normally.
   */
  public HomePingRequest(req: Request, res: Response): void {
    const shouldTriggerTestError =
      process.env.NODE_ENV !== "production" &&
      req.query.triggerTestError === "true";

    if (shouldTriggerTestError) {
      const testError = new Error("Test error for sentry instrumentation");
      Sentry.captureException(testError);
      res.status(500).json({ message: testError.message });
      return;
    }

    res.status(200).json({ message: "pong" });
  }
}
