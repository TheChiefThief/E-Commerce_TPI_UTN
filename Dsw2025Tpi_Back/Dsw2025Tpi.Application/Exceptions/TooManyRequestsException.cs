namespace Dsw2025Tpi.Application.Exceptions
{
    public class TooManyRequestsException(string message) : ApplicationException(message)
    {
    }
}
