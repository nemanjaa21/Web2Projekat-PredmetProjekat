using Microsoft.AspNetCore.Mvc;

namespace Online_Shop.Exceptions
{
    public class ConflictException : Exception
    {
        public ConflictException()
        {
        }

        public ConflictException(string message)
            : base(message)
        {
        }

        public IActionResult ToActionResult()
        {
            var problemDetails = new ProblemDetails
            {
                Status = 409, // Conflict status code
                Title = "Conflict",
                Detail = Message // Koristi poruku iz izuzetka kao detalj
            };
            return new ObjectResult(problemDetails)
            {
                StatusCode = problemDetails.Status
            };
        }

    }
}
