const errorMessage = (errors: string[]) => {
    return {
      errors,
      hasErrors: errors.length > 0,
    }
  }
  
  export default errorMessage
  